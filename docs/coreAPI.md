
### Core API

```
import { Provider, withRequest, Request, Requests } from 'questrar'
```

##### Provider component API

| Name |Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `stateProvider` | `StateProvider` | yes | `undefined` | External storage (redux, mobx) state provider which provides request states and sync request state updates with storage |



##### Request component API

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
|`id`| `RequestId`  | yes | `undefined` | Request id is used to track a request. Request id doesnt need to have a request state. If no request state is found, a default state is represented |
|`inject`| `boolean \| (requestProp) => object`  | no | `false` | If set as true, the request state would be injected into the single children component as `{ request: RequestProp }`. If set as a function, the function would receive the request state and return a typeof object which would then be added to the underlying component props. If inject function output type is not object, the resulting output would be wrapped as `{ request: output }`|
|`pendOnMount` | `boolean`, `Node`, `(requestProp, children) => Node` | no | `false` | Render a loading/pending element immediately when Request component is mounted until requestState is pending or failed or successful. Useful if the underlying component will throw without data. If pendOnMount is set true, it falls back to render pending component. This functionality is different from `onPending`. |
|`onPending` | `Node`, `(requestProp, children) => Node` | no | Inbuilt 16px spinner | Render a custom loading/pending element when request state is pending. |
|`onFailure`        | `Node`, `(requestProp, children) => Node` | no | `children` | Render a custom failure component when request state is failed. |
|`onSuccess`   | `Node`, `(requestProp, children) => Node`| no | `children` | Render a custom success component when request state is successful.|
|`stateProvider` | `StateProvider`| no | `undefined` | StateProvider prop which overrides the Provider component `stateProvider` prop for the particular `Request` component it's provided to.|

##### Requests component API
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `(props: Object) => RequestId` | yes | `undefined` | A function that receives the child props to generate a request Id. |

> The rest of the props follow `Request` API above.
 Except for `id` and `stateProvider` prop on the `Requests` component, any other props on the `Requests` component can be overridden by a setting its override on the child.

```jsx harmony
<Requests
 id={(props) => props.id}
 inject
 onPending={<CoolSpinner />}
>
  <Todo id={232} data={{...}} inject={false} onPending={<SuperCoolSpinner />} />
  <Todo id={234} data={{...}} onPending={false} />
</Requests>
``` 

##### withRequest options API 


| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `string`, `number`, `Array< string\|number >`, `(props) => string \| number` | no | `undefined` | Request id or list of request ids |
| `mergeIdSources` | `boolean` | no | `false` | Combine id and `props.id` for request state selection |
| `keepSingleRequestMap` | `boolean` | no | `false` | Keep a single request state as a [`RequestMapProp`](.../readme.md#L242) instead of [`RequestProp`](.../readme.md#L53) |
|`stateProvider` | `StateProvider`| no | `undefined` | StateProvider prop which overrides the Provider component `stateProvider` prop for the particular `withRequest` which it's provided to.|
