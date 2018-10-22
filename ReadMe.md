

Questrar is a simple React request state tracker for managing states of requests.

Installation
--

```bash
yarn add questrar 

npm install questrar
```

And? Why?
--
We often tend to show a loading circle or gear icon on our buttons and pages and overlays when a particular request is in flight.
And as soon as the request settles, the loading icon is cleared off and the
content of the processed request (either successful or failed), is shown to the user.
This is very nice when user sees request loading especially when network is throttling to make the user calm and comfortable.
This is often limited to a particular scope and often a particular element too.
And if you are working with React, you would have to pass props around or declare a higher parent to pass request states among children.
If we got the chance to hide some buttons somewhere, alert a notification,
show a loading icon and many of those at once and seamlessly just because of a common(:precious) single request,
then why not make it better with more control and accessibility with Questrar?


A request state is typed as
```typescript
// @flow
type RequestState = {
    id: string,
    pending: boolean,
    success: boolean,
    failed: boolean,
 
    successCount: number, // default 0
    failureCount: number, // default 0
    
    message?: any,
    
    autoRemove?: boolean,
    removeOnSuccess?: boolean,
    removeOnFail?: boolean
}

type RequestProp = {
    data: RequestState,
    actions: {
       pending: (id: string | number, message?: any) => void, //set request state of id to pending
       failed: (id: string | number, message?: any) => void,  //set request state of id to failed
       success: (id: string | number, message?: any) => void, //set request state of id to success
       remove: (id: string) => void, //remove completely
    }    
}
```

A default request state
```js
const defaultRequestState: RequestState = {
    pending: false,
    success: false,
    failed: false,
    successCount: 0,
    failureCount: 0,
    clean: true,
}
```

A requestState is simple to use in a React component by wrapping the component tree with the `Provider`

```js
const RequestStateProvider = require('questrar').Provider;
```
```js
import { Provider as RequestStateProvider } from 'questrar';
```

```jsx harmony
export class AppMain extends React.Component<Props> {
   props: Props;
   
   render (){
    
     return (
      <RequestStateProvider>
        <App />
     </RequestStateProvider>
    }
}
```
Now you can use the `Request` component in any of your components anywhere deep, anyhow deep.

A `Request` component requires an id which would be used to track a request.
An id is recommended to be a `string` or `number`. 
`Symbol` should be used carefully since the `Symbol()` creates a new different object every time.

A request id should be a bit unique to a particular subject context. For instance, if you have a user account
which can have many queries to api, (fetch user, edit user, delete user, upload photo), 
its bearable not to use a single request id (which obviously may be userId) for all these actions on the user.
Instead, you can just concat to do
 ```js
 const fetchProfileRequestId = `${userId}_fetch`;
 const updateRequestId = `${userId}_update`;
 const deleteUserId = `${userId}_delete`
```
The consequence of using same id looks like showing a pending delete when indeed user is uploading a photo.


You don't have to create a request inside a component.
You just provide an id. If the id has no requestState, a default one is returned.

```flow js
import { Request, withRequest } from 'questrar'; 
```

```js
export const UserProfile = ({ userId, data }) => {
    
    return (
      <Request id={userId} initialPending >
        <ProfileView data={data} />
      </Request>
    );
}
```

Where you explicitly want to use the request state object, you can use the inject parameter on `Request`;

```jsx harmony
<Request id={stringOrNumberId} initialPending inject />
```

`inject` can be a boolean or a function with signature `(request: RequestProp) => {"anyParam": params} | request`
 which would be recieved by the underlying component.
 
```jsx harmony
 export const UserProfile = ({ userId, data }) => {
   
 const injector = (request: RequestProp) => {
    return {
      loading: request.data.pending,
      disable: request.data.pending || request.data.success || request.data.failureCount > 5,//disable after 5 request failures
    };
 };
 
 return (
  <Request id={stringOrNumberId} inject={injector} >
    <Button >Fetch Profile</Button>
  </Request>
 );
}
```

At some point where the `Request` component isn't that helpful to use with your component, 
you can try with the `withRequest` HOC and expect the `request` state as a prop.


```jsx harmony
import { Request, withRequest } from 'questrar';

 const UserProfile = ({ userId, data, request }) => {
    if(request.data.success){
        const id = request.data.id; //request id
        request.actions.remove(id)
    }
    
    return (
      <div>
       <Banner content={request.data.message} />
        { !request.data.pending && <ProfileView data={data} />}
       <Button
        disable={request.data.pending || request.data.success}
        loading={request.data.pending}
       >
        Fetch User Profile
       </Button>
      </div>
    );
};
export default withRequest()(UserProfile);
```
```js
type RequestComponentOptions = {
  id?: string | Array<string> | (props: Props) => (string | Array<string>),
  mergeIdSources?: boolean, //merge id and props.id (if there is)
}

export withRequest(options?: RequestComponentOptions)(Component)
```

`withRequest` takes an **optional single id** or **optional list of ids** or **any function**
 that can convert the props of wrapped component to a single id or list of ids as argument.

`withRequest` automatically takes `props.id` if `options.id` is empty. Thats to say `options.id` has precedence over `props.id`.
However, if you require `options.id` to merge with `props.id`, set `mergeIdSources` to true.
This will merge `options.id` with `props.id` with no duplicates and
 return an object similar to `RequestProp` type to the component as `props.request` but typed as

 ```typescript
 { data: { [id: string | number]: RequestState }, //instead of data: RequestState
   actions: {
    pending: (id: string | number, message?: any) => void, //set request state of id to pending
    failed: (id: string | number, message?: any) => void,  //set request state of id to failed
    success: (id: string | number, message?: any) => void
   }
 }
``` 
 
Any of `props.id` or `options.id` is optional. If no id is found, no state is returned.
 Thus, `request.data === defaultRequestState`

* Note: If a single id is provided by combined `props.id` or `options.id`,
 a `RequestProp` is return instead of above type:

Creating a request state outside component
--

In cases where we want to make fetch requests outside the component
 and track them inside the requesting component or anywhere in a number of components.
Then we need to store the whole request state outside the component tree to provide easy access across the app.

* Note: the following examples are using **Redux** store

For instance, with redux, since we are going to store all of the request states in redux, we need to add Redux reducer to our root reducers.
 and create a ReduxStateProvider which would provide us with the requestStates to our components.
  
```js
import { requestStateReducer } from 'questrar/redux';


const reducers = combineReducers({
'app': appReducer,
'some': someReducer,

...requestStateReducer //redux requestState reducer
});
```
In case `requestStateReducer` is nested one or more levels deep in the reducer map,
 we'd need to provide the reducer path to our StateProvider.
A `requestStateReducer` path to object should be delimited with a `.`

For instance, path of `{ app: { operation: { ticket: { requestStateReducer }}}}` is `'app.operation.ticket'`

```jsx harmony
import { createStore } from 'redux';
import type { Store } from 'redux';
import { Provider as RequestStateProvider } from 'questrar';
import { createStateProvider } from 'questrar/redux';

const store: Store = createStore(reducers, initialState, compose);

const path = 'app.operation.ticket'; //path to requestStateReducer in Redux reducer map

const stateProvider = createStateProvider(store, path?: string);

export class AppMain extends React.Component<Props> {
   props: Props;
   
   render (){
    
     return (
      <RequestStateProvider stateProvider={stateProvider} >
        <App />
     </RequestStateProvider>
    }
}
```

The above looks like the previous but stores the all of request states in Redux unlike before. 
If you open your redux dev tools you can find requestStates by `'__QUESTRAR_REQUEST_'`

Then that's it, we can now create request states outside and track them inside.


```js
import { createRequestState } from 'questrar/redux';

export const fetchUserProfileState = createRequestState('REQUEST_ID'); //Create a requestState to begin with an id
export const publishPostRequestState = createRequestState(); //Create a requestState with generated unique id
export const likePostRequestState = createRequestState();
```

In case you will always have access to `fetchUserProfileState`, 
you can ignore the request id, just like `publishPostRequestState`. A unique id would be generated.
Else provide a request id so that you can recreate across module scopes.

* Using the thunk style
```js
fetch('api/user/profile').then(response => {
    dispatch({ type: 'USER_PROFILE_SAVE', payload: response});
    dispatch(fetchUserProfileState.success(optionalMessage)); //request.data.message === optionalMessage
}).catch(error => {
    ...
    dispatch(fetchUserProfileState.failed('Sorry, could not load your profile'));
})
```

* Using the saga style
```js
export function* fetchUserProfileSaga(): Generator<*, *, *> {
    while(true) {
        const { payload } = yield takeRequest(fetchUserProfile().type);
        try {
            yield put(fetchUserProfileState.pending('Loading your profile'); //request.data.message === 'Loading your profile'
            
            const response = yield call(fetchApi, 'api/user/profile', payload);
            yield put({type: 'USER_PROFILE_SAVE', payload: response});
            
            yield put(fetchUserProfileState.success()); // request.data.success === true
        } catch(e) {            
            yield put(fetchUserProfileState.failed('Sorry, could not load your profile'));
        }
    }
}
```
And then:

```jsx harmony
import { fetchUserProfileState } from 'somewhere/file';

export const UserProfile = ({ userId, data }) => {
   
 const injector = (request: RequestProp) => {
    return {
      loading: request.data.pending,
      disable: request.data.pending || request.data.success || request.data.failureCount > 5,//disable after 5 request failures
    };
 };
 
 return (
  <Request
   id={fetchUserProfileState() || fetchUserProfileState.id || fetchUserProfileState.toString()}
   inject={injector} 
  >
    <Button >Fetch Profile</Button>
  </Request>
 );
}
```
`fetchUserProfileState.id` and `fetchUserProfileState()` are recommended ways of extracting id. If you use number as request id,
`fetchUserProfileState.toString()` will coerce to string which will not match and instead create a new requestState.

API
--

* Provider API

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `stateProvider` | no | `undefined` | External storage (redux, mobx) state provider which provides request states and sync request state updates with storage |

* createStateProvider (Redux) API

| Name | type | Required | Default | Description |
| --- | --- |--- | --- | --- |
|`store` | Redux store | yes | `undefined` | Redux store object |
|`path`| `string` | no | `''` | Path to the `requestStateReducer` placed in your redux reducer map. Path to `requestStateReducer` is only needed if reducer is placed deeper (one level or more) in the reducer map  |



* Request API

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
|`id`               | `string`  | yes | `undefined` | Request id is used to track a request. Request id doesnt need to have a request state. If no request state is found, a default state is represented |
|`inject`           | `boolean` or `(requestProp) => object` | no | `false` | If set as true, the request state would be injected into the underlying component as `{ request: requestState }`. If set as a function, the function would receive the request state and return a typeof object which would then be added to the underlying component props. If function output type is not object, the resulting output would be `{ request: output }` |
|`initialPending`   | `boolean` | no | `false` | Render a loading element immediately when component is mounted until request has failed or successful. Useful if the underlying component will throw error without data |
|`passivePending`   | `boolean` | no | `false` | Do not show any signs of loading. Render the underlying component (eg. Button) as a loading element instead of a loading icon. |
|`renderInitial`    | `Node` | no | Loading icon | If `initialLoading` is set true and `renderInitial` is provided, then `renderInitial` would be rendered. Thus, `renderInitial` renders once and only when `initialLoading` is set |
|`renderLoading`    | `Node` or  `(requestProp) => Node` | no | Loading icon | A component that should be rendered whiles request is pending. If `renderLoading` is a component and `inject` is set, then `renderLoading` component would be injected  |
|`onFailure`        | `(requestProp) => void` | no | `undefined` | A callback called everytimes a request fails |
|`renderFailure`    | `Node` or  `(requestProp) => Node` | no | `undefined` | Render on request failure |
|`passiveOnFailure` | `boolean` | no | `false` | Just like `passivePending`. Do not show any visual sign of failure, no failure message, no `renderFailure` rendering |
|`failTooltip`      | `boolean` | no | `false` | Show a responsive error tooltip/popup with `request.data.message` around the underlying component (if its not an array) signifying request failure. Stackoverflow error message like feature. Tooltip only closes onClick|
|`onCloseFailure`   | `(requestProp) => void` | no | `undefined` | A callback function called when failure component is unmounted. For instance when user closes tooltip |
|`successTooltip`   | `boolean` | no | `false` | Just line `failTooltip`, renders a tooltip on underlying component |
|`successReplace`   | `boolean` | no | `false` | Overrides `successTooltip`. Replace the underlying component with `request.data.message`|
|`onCloseSuccess`   | `(requestProp) => void`| no | `undefined` | Callback called when request success component (tooltip) is unmounted|



* withRequest API 

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `string`, `number`, `Array< string\|number >`, `(props) => string \| number` | no | `undefined` | Request id or list of request ids |
| `mergeIdSources` | `boolean` | no | `false` | Combine id and `props.id` for request state selection |


* createRequestState (Redux) API

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | ---|
|`id`                      | `string\|number` | no | random string | Request state id which would be used to manage request state across modules. If not provide, a random id is generated |
|`options`                 | `object` | no | `undefined` | see below |
|`options.autoRemove`      | `boolean` | no | `undefined` | Auto remove request state from store after error or success reporting component is umounted |
|`options.removeOnFail`    | `boolean` | no | `undefined` | Auto remove request state from store after error reporting component is umounted |
|`options.removeOnSuccess` | `boolean` | no | `undefined` | Auto remove request state from store after success reporting component is umounted |

* A request state can also be removed manually. 
```jsx harmony 
const reqState = createRequestState();
reqState.pending(<span>Cool loading icon <i className="" /></span>);
reqState.remove();     // removes request completely from store. 
reqState.success("I'm reincarnated") // recreates in store from a fresh request state
```



Credits
--

- Inspired by Christian Kaps [@akkie](http://github.com/akkie)
