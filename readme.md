
Questrar is a simple React request state tracker for managing states of requests.

[![npm version](https://badge.fury.io/js/questrar.svg)](https://badge.fury.io/js/questrar)
[![Maintainability](https://api.codeclimate.com/v1/badges/f844416f4e3c15b8ae22/maintainability)](https://codeclimate.com/github/orar/questrar/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f844416f4e3c15b8ae22/test_coverage)](https://codeclimate.com/github/orar/questrar/test_coverage)
[![Build Status](https://travis-ci.org/orar/questrar.svg?branch=master)](https://travis-ci.org/orar/questrar)

Installation
--

```bash
yarn add questrar 

npm install questrar
```

Why Questrar?
--
The state of an app request is necessary to user's interactivity and experience. 
Continually, App needs to fetch data from server or do a complex computation. It's important to let the user know if 
request is still loading, failed or successful. 
This can be repetitive and hard to work around with and you are likely going to need in every
application which fetches data from server or anywhere else.
 
Questrar alleviates those needs into a simple `<Request />` wrapper - with the help of 
React's composability making it easy to control, track request,
 show loading icons and failed messages and other UI transformations based on a state of specific request.
 
 
#### [Working with redux](docs/createReduxStateProvider.md)
#### See [API](docs/coreAPI.md) section


A request state is typed as
```typescript
// @flow
type RequestState = {
    id: RequestId,
    pending: boolean,
    success: boolean,
    failed: boolean, 
    
    clean: boolean,
 
    successCount: number, // default 0
    failureCount: number, // default 0
    
    message?: any | { title: any, body: any },
    
}

type RequestProp = {
    data: RequestState,
    actions: {
       pending: (id: string | number, message?: any) => void, // set request state of id to pending
       failed: (id: string | number, message?: any) => void,  // set request state of id to failed
       success: (id: string | number, message?: any) => void, // set request state of id to success
       remove: (id: string) => void, //remove completely
       clean: (id: string) => void, // set request as untouched
       dirty: (id: string) => void, //  set request as touched
    }    
}
```

A default request state (initial request state or provided when request state is not found by id)
```js
const defaultRequestState: RequestState = {
    id: 'newRequestId',
    pending: false,
    success: false,
    failed: false,
    successCount: 0,
    failureCount: 0,
    clean: true,
    message: undefined
}
```

A requestState is simple to use in a React component by wrapping the component tree with the `Provider`.

> `stateProvider` prop is required.

```jsx harmony
import { Provider } from 'questrar';
import type { StateProvider } from 'questrar';
import defaultRequestStateProvider  from 'questrar/store';

const stateProvider: StateProvider = defaultRequestStateProvider();

export const AppMain = () => (
  <Provider stateProvider={stateProvider}>
    <App />
  </Provider>
)
```
Now you can use the `Request` component in any of your components anywhere deep, anyhow deep.

```jsx harmony
const App = () => (
<Request id="id">
  <View />
</Request>
)
```

A `Request` component requires an id which will be used to track a request.
An id is recommended to be a `string` or `number`. 
`Symbol` should be used carefully since `Symbol()` creates a new different object every time.

A request id should be a bit unique to a particular subject context. For instance, if you have a user account
which can have many queries to api, (fetch user, edit user, delete user, upload photo), 
its bearable not to use a single request id (which obviously may be userId) for all these actions on the user.
Instead, you can just concat to do
 ```js
 const fetchProfileRequestId = `${userId}_fetch`;
 const deleteUserId = `${userId}_delete`
```
The consequence of using same id looks like showing a pending delete when indeed user is uploading a photo.


You don't have to create a request state inside a component.
You just provide an id. If the id has no requestState, a default one is returned but never saved.
 A request state is saved if there is an update action on the request state

```js
import { Request } from 'questrar'; 

export const UserProfile = ({ userId, data }) => {
    
    return (
      <Request id={userId} pendOnMount >
        <ProfileView data={data} />
      </Request>
    );
}
```

With `Requests` component, `id` prop is a function which will extract request Ids from underlying children elements.
```jsx harmony
import { Requests } from 'questrar'; 

export const UserTodo = ({ userId, data }) => {
    
    return (
      <Requests id={(props) => props.requestId} inject  >
        {data.map(todo => <TodoView requestId={todo.id} data={todo} inject={false} />)}
      </Requests>
    );
}
```
`Requests` efficiently caches and selectively updates only children whose request states have changed.
 However, this is not enabled by default. You can enable by setting `skipOldTrees` prop to `true`.

Where you explicitly want to access the request state object, you can use the `inject` prop on `Request`;

```jsx harmony
<Request id={userId} pendOnMount inject>
  <ProfileView data={data} />
</Request>
```

`inject` can be a boolean or a function with signature `(request: RequestProp) => Object`
 which would be received by the underlying component.
 
```jsx harmony
 export const UserProfile = ({ userId, data }) => {
   
 const mapToButtonProps = (request: RequestProp) => {
    return {
      loading: request.data.pending,
      disable: request.data.pending || request.data.success || request.data.failureCount > 5,//disable after 5 request failures
      onClick: () => request.actions.success(request.data.id)
    };
 };
 
 return (
  <Request id={stringOrNumberId} inject={mapToButtonProps} >
    <Button >Fetch Profile</Button>
  </Request>
 );
}
```

At some point where the `Request` component isn't that helpful to use with your component, 
you can try with the `withRequest` HOC and expect the `request` state as a prop.


```jsx harmony
import { withRequest } from 'questrar';

type Props = {
  userId: string,
  data: Object,
  request: RequestProp
}

 const UserProfile = ({ userId, data, request }: Prop) => {
    if(request.data.dirty){
        const requestId = request.data.id;
        request.actions.remove(requestId)
    }
    
    return (
      <div>
        {request.data.failed && <Banner content={request.data.message} />}
        {request.data.success && <ProfileView data={data} />}
       <Button
        disable={request.data.pending || request.data.success}
        loading={request.data.pending}
       >
        Fetch User Profile
       </Button>
      </div>
    );
};

export default withRequest({ id: (props) => props.userId })(UserProfile);
```
`withRequest` takes these options:
```typescript
type RequestComponentOptions = {
  id?: RequestId | Array<RequestId> | (props: Props) => (RequestId | Array<RequestId>),
  mergeIdSources?: boolean, //  merge options.id and props.id (if there is any),
  keepSingleRequestMap?: boolean, //  keep a single request state data map,
  stateProvider?: StateProvider, // this stateProvider overrides the Provider stateProvider 
}

export default withRequest(options?: RequestComponentOptions)(Component)
```

`withRequest` takes an **optional single id** or **optional list of ids** or **optional function**
 that can convert the props of the wrapped component to a single id or list of ids.

`withRequest` automatically takes `options.id` (if there is) if `props.id` is empty.
Thats to say `props.id` has precedence over `options.id`.
However, if you require `props.id` and `options.id` to merge, set `mergeIdSources` to true.
This will merge `props.id` and `options.id` with no duplicates and
 return an object typed as `RequestMapProp` similar to `RequestProp`.

 ```typescript
type RequestMapProp = {
    data: { [id: RequestId ]: RequestState }, //instead of data: RequestState
    actions: {
       pending: (id: string | number, message?: any) => void, //set request state of id to pending
       failed: (id: string | number, message?: any) => void,  //set request state of id to failed
       success: (id: string | number, message?: any) => void
    } 
}
``` 
 
Any of `props.id` or `options.id` is optional. If no id is found, an empty object is returned

> Note: By default if a single id is provided by `props.id` or `options.id` or both(if `mergeIdSources` is `true`),
 a `RequestProp` is returned instead of `RequestMapProp`. 
 You can disable this behavior by setting `options.keepSingleRequestMap` to `true`



Feedback
--

Any feedback and PR contributions will be appreciated regardless.


Credits
--

- Inspired by Christian Kaps [@akkie](http://github.com/akkie)

