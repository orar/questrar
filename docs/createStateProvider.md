
Creating a state provider
--
Questrar is agnostic to your app storage implementation. The above implementation used redux as the storage of the app.
You could also create your implementation and provide as a prop to `RequestStateProvider`

```js
function createOtherStateProvider() {
    
    const getState = () => {
        return state; //get state from storage
    };
    
    const putState = (wholeRequestStateData) => {}; //replaces entire state
    
    /**
    * Observes store changes and updates the Provider if it should
    * @param updateProvider
    */
    const observe = (updateProvider: (shouldUpdate: boolean) => void) => {
       return store.state.hasChanged ? updateProvider(true) : updateProvider(false);
    };
    
    /**
    * Syncs request state changes from component tree
    * Pushes an update of a particular requestState to store
    * Consider using status(pending, failed, success, remove) to switch type of update
    * @param requestStatus
    */
    const updateRequest = (requestStatus) => {
        const { id, status, message? } = requestStatus;
        updateRequestById(id, status, message)
    };
    
    return {
      getState, putState, observe, updateRequest,
    }
}
```

And then 

```jsx harmony
import { Provider } from 'questrar';

const stateProvider = createOtherStateProvider();

const App = ({ }) => {
  return (
    <Provider stateProvider={stateProvider} >
       <AppComponent />
    </Provider>
  );
}
```
