
Creating a state provider
--
Questrar is agnostic to your app storage implementation. The [readme](../readme.md) implementation used redux as the storage of the app.
You can also create your implementation and provide as a `stateProvider` prop to `Provider` component. 

You can checkout the [DefaultStateProvider](../src/store/createStateProvider.js) and [ReduxStateProvider](../src/redux/createStateProvider.js). 

```js
function createYourStateProvider() {
      const name: string = 'Your.State.Provider'; //name of your storage provider
      
      const state = createSomeState();
      
      const getState = (): ProviderRequestState => {
          return state.getState(); //get state from storage
      };
            
      /**
      * Observes store changes and updates the Provider if it should
      * @param updateProvider
      */
      const observe = (updateProvider: (shouldUpdate: boolean) => void) => {
        state.subscribe(() => {
          updateProvider(getState())
        });
      };
      
      /**
      * Syncs request state changes from component tree
      * Pushes an update of a single request state to store
      * Consider using status('pending', 'failed', 'success', 'remove', 'clean' and 'dirty') to switch type of update
      * @param requestAction
      */
      const updateRequest = (requestAction) => {
          const { id, status, message? } = requestAction;
          
          switch (status) {
            case PENDING:
              state.pending(id, message);
              break;
            case FAILED:
              state.failed(id, message);
              break;
            case SUCCESS:
              state.success(id, message);
              break;
            case REMOVE:
              state.remove(id);
              break;
            case CLEAN:
              state.clean(id);
              break;
            case DIRTY:
              state.dirty(id);
              break;
            default:
              break;
          }
      };
      
      //Required endpoints
      return {
       name, getState, observe, updateRequest,
      }
}
```

And then 

```jsx harmony
import { Provider } from 'questrar';

const stateProvider = createYourStateProvider();

const App = ({ }) => {
  return (
    <Provider stateProvider={stateProvider} >
       <AppComponent />
    </Provider>
  );
}
```
