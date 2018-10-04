

Questrar is a simple React request state tracker for managing state of a request.

A request state is typed as
```
// @flow
type RequestState = {
    id: string,
    pending: boolean 
    success: boolean
    failed: boolean
 
    successCount: number, // default 0
    failureCount: number, // default 0
    
    message?: any,
    
    autoRemove?: boolean,
    removeOnSuccess?: boolean,
    removeOnFail?: boolean
}
```

A default request state
```
const defaultRequestState = {
    pending: false
    success: false
    failed: false
    successCount: 0
    failureCount: 0
}
```

A requestState is simple to use in a React component by wrapping the component tree with the RequestStateProvider

`import { Provider as RequestStateProvider } from 'questrar';`

```
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
Now you can use the `Request` component in any of your component anywhere, anyhow.

A `Request` component requires an id which would be used to track a request.
A request id should be a bit unique to a particular subject context. For instance, if you have a user account
which can have many queries to api, (fetch user, edit user, delete user, upload photo), 
its bearable not to use a single request id (which obviously may be userId) for all these actions on the user.
Instead, you can just tweak to do
 ```
 const updateRequestId = `${userId}_update`;
 const deleteUserId = `${userId}_delete`
```
The consequence of using same id looks like showing a pending delete when indeed user is uploading a photo.
You don't have to create a request inside a component.
You just provide an id. If the id has no requestState, a default one is returned.

`import { Request, withRequest } from 'questrar'; `

```
export const UserProfile = ({ userId, data }) => {
    
    return (
      <Request id={userId} initialLoading >
        <ProfileView data={data} />
      </Request>
    );
}
```

Where you explicitly want to use the request state, you can use the inject parameter on `Request`;

`<Request id={anyId} initialLoading inject />`.
`inject` can be a bool or a function with signature `(request: RequestState) => {"anyParam": params} | request`
 which would be recieved by the underlying component.
 
 ```
 const injector = (request: RequestState) => {
    return { loading: request.data.pending };
 }
 <Request id={anyId} inject={injector} >
    <Button >Fetch Profile</Button>
 </Request>
 
```

At some point where the `Request` component isnt that helpful to use with your component, 
you can try with the `withRequest` HOC and expect the `request` state as a prop.

`import { Request, withRequest } from 'questrar'; `

```
 const UserProfile = ({ userId, data, request }) => {
    if(request.data.success){
        const id = request.data.id;
        request.actions.remove(id)
    }
    
    return (
      <div>
       <Banner content={request.data.message} />
       { !request.data.pending && <ProfileView data={data} />}
       <Button loading={request.data.pending} >Fetch User Profile</Button>
      </div>
    );
}
export withRequest()(UserProfile);
```
```
type RequestComponentOptions = {
  id?: string | Array<string> | (props: Props) => (string | Array<string>),
  mergeIdSources?: boolean = false,
}

export withRequest(options?: RequestComponentOptions)(Component)

```
`withRequest` takes an optional id or optional list of ids or any function
 that can convert the props of component to an id or list of ids as argument.

`withRequest` automatically takes `props.id` if `options.id` is empty. Thats to say `options.id` has precedence over `props.id`.
However if you require `options.id` to merge with `props.id`, set `mergeIdSources` to true.
This will combined with `options.id` and `props.id` with no duplicates and return an object of `{ [id]: RequestState }` as prop to the wrapped component.
Any of `props.id` or `options.id` is optional. If no id is found, no state is returned.

* Note: If a single id is provided by either `props.id` or `options.id` or both,
 a single request state is returned instead of an associative array of single request state

Creating a request state outside component
--

In cases where we want to make fetch requests outside the component
 and track them inside the requesting component or anywhere.
Then we need to store the whole request state outside the component tree to provide easy access across the app.

* Note: the following examples are using redux

For instance, with redux, since we are going to store the request state in redux, we need to add Redux reducer to our root reducers.
 and create a StateProvider which would provide us with the requestState to our components.
  
```
import { requestStateReducer } from 'questrar/redux';

const reducers = combineReducers({
'app': appReducer,
'some': someReducer,

...requestStateReducer
});

```
In case `requestStateReducer` is nested deep in the reducer map, we'd need to provide the reducer path to our StateProvider.
A `requestStateReducer` path to object should be delimited with a `.`

For instance, `'app.operation.ticket' === { app: { operation: { ticket: { requestStateReducer }}}}`

```
import { createStore } from 'redux';
import type { Store } from 'redux';
import { Provider as RequestStateProvider } from 'questrar';
import { createStateProvider } from 'questrar/redux';

const store: Store = createStore(reducers, initialState, compose)
const path = 'app.operation.ticket'; //path to requestStateReducer

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

The above looks like the previous but stores the all of request states in redux unlike before. 
If you open your redux dev tools you can find requestStates by `'__QUESTRAR_REQUEST_'`

Then that's it, we can now create requests outside and track them inside.


```
import { createRequestState } from 'questrar/redux';

export const fetchUserProfileState = createRequestState('REQUEST_ID'); //Create a request action to begin
export const publishPostRequestState = createRequestState();
export const likePostRequestState = createRequestState();
```

In case you will always have access to `fetchUserProfileState`, you can ignore the request id. A unique id would be generated.
Else provide a request id so that you can recreate across module scopes.

* Using the thunk style
```
fetch('api/user/profile').then(response => {
    dispatch({ type: 'USER_PROFILE_SAVE', payload: response});
    dispatch(fetchUserProfileState.success(optionalMessage)); //request.data.message === optionalMessage
}).catch(error => {
    ...
    dispatch(fetchUserProfileState.failed('Sorry, could not load your profile'));
})
```

* Using the saga style
```
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


Credits
--

- Inspired by Christian Kaps @akkie