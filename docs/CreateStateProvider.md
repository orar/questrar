
Creating a state provider
--
Questrar looks agnostic to your app storage implementation. The above implementation used redux as the storage of the app.
You could also create your implementation and provide as a prop to `RequestStateProvider`

```
function createOtherStateProvider() {
    
    getState = () => {
        return state;
    }
    
    putState = (wholeRequestStateData) => {} //replaces state
    
    observe = (reRender: (shouldUpdate: boolean) => void) => {
       return state.hasChanged ? reRender(true) : reRender(false);
    }
    
    updateRequest = (requestStatus) => {
        const { id, status, message? } = requestStatus;
        updateRequestById(id, status, message)
    }
}
```

And then 

```
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
