
### Working with Redux


In cases where we want to make fetch requests outside the component
 and track them inside the requesting component or anywhere in any number of components.
 Then we need to create request states explicitly. Since we are fetching outside the component tree,
  we also would have to update request states from store outside the component tree.
 This actually depends on the state provider implementation


> Note: the following snippets are using **[Redux](https://redux-js.org)** store.
 You can create your custom storage implementation with [createStateProvider](docs/createStateProvider.md) 
 You can checkout actual implementation for [ReduxStateProvider](src/redux/createStateProvider.js). 


With Redux, since we are going to store all of the request states in redux, we need to add Redux reducer to our root reducers.
 and create a ReduxStateProvider which will provide the component tree with the requestStates to sub components.
  
```js
import { requestStateReducer } from 'questrar/redux';


const rootReducer = combineReducers({
'app': appReducer,
'some': someReducer,

...requestStateReducer //redux requestState reducer. Take note of the spread syntax
});
```
This `rootReducer` is the root reducer and request state reducer is not deep.
In case `requestStateReducer` is nested one or more levels deep in the reducer map,
 we'd need to provide the reducer path to the StateProvider.
A `requestStateReducer` path should be delimited with a `.`

For instance, path of `{ app: { operation: { ticket: { ...requestStateReducer }}}}` is `'app.operation.ticket'`

```jsx harmony
import { createStore, compose } from 'redux';
import type { Store } from 'redux';
import { Provider as RequestStateProvider } from 'questrar';
import { createStateProvider } from 'questrar/redux';

const store: Store = createStore(reducers, initialState, compose);

const path = 'app.operation.ticket'; // path to requestStateReducer in Redux reducer map

const stateProvider = createStateProvider(store, path?: string);

export class AppMain extends React.Component<Props> {
   props: Props;
   
   render (){
    
     return (
      <RequestStateProvider stateProvider={stateProvider}>
        <App />
      </RequestStateProvider>
     )
   }
}
```

The above looks just like the [previous](../readme.md) but stores the all of request states in Redux unlike before. 
If you open your redux dev tools you can find all requestStates by `'_QUESTRAR_REQUEST_'`

That's it. We can now create request states and dispatch updates to store while we use them in our components.

##### Creating a request state


```js
//requestStates.js
import { createRequestState } from 'questrar/redux';

export const fetchUserProfileState = createRequestState('REQUEST_ID'); //Create a requestState with an explicit id
export const publishPostRequestState = createRequestState(); //Create a requestState with generated unique id
```
`createRequestState` creates a base redux action which will update a specific request state.
In case you will always have access to `fetchUserProfileState`, 
you can ignore the request id, just like `publishPostRequestState`. A random id would be generated.
Otherwise provide a request id so that you can recreate across module scopes and also ease testing.


* Using the thunk style
```js
import { fetchUserProfileState } from './requestStates';

fetch('api/user/profile').then(response => {
    dispatch({ type: 'USER_PROFILE_SAVE', payload: response});
    dispatch(fetchUserProfileState.success(optionalMessage)); //request.data.message === optionalMessage
}).catch(error => {
    ...
    dispatch(fetchUserProfileState.failed('Sorry, could not load your profile at this time'));
})
```

* Using the saga style
```js
import { fetchUserProfileState } from './requestStates';

export function* fetchUserProfileSaga(): Generator<*, *, *> {
    while(true) {
        const { payload } = yield takeRequest(fetchUserProfile().type);
        try {
            yield put(fetchUserProfileState.pending('Loading your profile');
            
            const response = yield call(fetchApi, 'api/user/profile', payload);
            yield put({type: 'USER_PROFILE_SAVE', payload: response});
            
            yield put(fetchUserProfileState.success());
        } catch(e) {            
            yield put(fetchUserProfileState.failed('Sorry, could not load your profile'));
        }
    }
}
```
And then:

```jsx harmony
import { fetchUserProfileState } from './requestStates';

export const UserProfile = ({ userId, data }) => {
   
 const mapRequestToButtonProps = (request: RequestProp) => {
    return {
      loading: request.data.pending,
      disable: request.data.pending || request.data.success || request.data.failureCount > 5,//disable after 5 request failures
    };
 };
 
 return (
  <Request
   id={fetchUserProfileState() || fetchUserProfileState.id}
   inject={mapRequestToButtonProps} 
  >
    <Button >Fetch User Profile</Button>
  </Request>
 );
}
```

#### API

##### createStateProvider (Redux) API
```js
import { createStateProvider } from 'questrar/redux';

createStateProvider(store, path)
```

| Name | type | Required | Default | Description |
| --- | --- |--- | --- | --- |
|`store` | Redux store | yes | `undefined` | Redux store object |
|`path`| `string` | no | `''` | Path to the `requestStateReducer` placed in your redux reducer map. Path to `requestStateReducer` is only needed if reducer is placed deeper (one level or more) in the reducer map  |



###### const requestState = createRequestState(id: RequestId)
Create a function with the following props:

`requestState.id`
Gets a request state id


`requestState()`
Gets a request state id


`requestState.pending(message:? any)`
Creates an action to set a request state to pending with an optional message.


`requestState.failed(message:? any)`
Creates an action to set a request state to failed with an optional message.


`requestState.success(message:? any)`
Creates an action to set a request state to success with an optional message.


`requestState.dirty()`
Creates an action to set a request state prop `clean` to `false`.

`requestState.clean()`
Creates an action to set a request state prop `clean` to `true`.

`requestState.remove()`
Creates an action to remove a request state from store.
