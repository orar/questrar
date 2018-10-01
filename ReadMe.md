

Questrar is a simple React request state tracker for managing state of a request.

A request state is typed as
```
// @flow
type RequestState = {
    id: string,
    pending: boolean | any,  default false
    success: boolean | any,  default false
    failed: boolean | any,  default false
    successCount: number, // default 0
    failureCount: number, // default 0
}

//A default request state
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
`Request` doesnt wrap your underlying component with any dom element. It either replaces or return as same.

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
        request.actions.remove(userId)
    }
    
    return (
      <div>
       { !request.data.pending && <ProfileView data={data} />}
       <Button loading={request.data.pending} > Fetch User Profile </Button>
      </div>
    );
}
export withRequest()(UserProfile);
```

`withRequest` takes an optional list of ids as argument combined with props.id to track
 and return a list of states as prop to the wrapped component.
Any of props.id or argument is optional. If no id is found, no state is returned.
If a single id is provided, a single request state is returned instead of an array of single request state


In cases where we keep it clean and declarative, we want to make requests outside the component
 and track them inside the requesting component or anywhere.
Then we need to store the whole request state outside the component tree to provide easy access.

For instance, with redux, we need to create a StateProvider which would provide us with the requestState.


```
import { createStore } from 'redux';
import { ReduxStateProvider } from 'questrar/redux';

const store = createStore(reducers, ...)
const stateProvider = new ReduxStateProvider(store);

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

The above stores the whole of request state in redux unlike before.
Then now we can create requests outside and track them inside.



```
//Create a request action to begin
import { createRequest } from 'questrar/redux';

const fetchUserProfileState = createRequest('REQUEST_ID');
```

In case you will always have access to `fetchUserProfileState`, you can ignore the request id (`createRequest()`). An anon id would be generated.
Else provide a request id that you can track across scopes.

Using the thunk style
```
fetch('api/user/profile').then(response => {
    dispatch({ type: 'USER_PROFILE_SAVE', payload: response});
    dispatch(fetchUserProfileState.success(optionalMessage)); //request.data.success === optionalMessage
}).catch(error => {
    ...
    dispatch(fetchUserProfileState.failed(e.optionalMessage));
})
```

Using the saga style
```
export function* fetchUserProfileSaga(): Generator<*, *, *> {
    while(true) {
        const payload = yield takeRequest(fetchUserProfile().type);
        try {
            yield put(fetchUserProfileState.pending('any loading text or progress');
            const response = yield call(fetchApi, 'api/user/profile');
            yield put({type: 'USER_PROFILE_SAVE', payload: response});
            yield put(fetchUserProfileState.success()); // request.data.success === true
        } catch(e) {
            yield put(fetchUserProfileState.failed(e.message));
            
            // You could also autoDelete on request success or failed
            yield put(fetchUserProfileState.failed(null, autoDelete));
        }
    }
}
```

`autoDelete` delete the requestState as on settling, ie either success or failure. No success or failure message would be shown to the user.
 Thus if you are only interested in showing pending state of a request, autoDelete would be helpful to you


- Inspired by Christian Kaps @akkie