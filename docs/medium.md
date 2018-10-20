Reporting state of your request in React
--


All the time, apps need to make request to backend/api to fetch some data to show to user.
Considering that you need to request some data from server creates a barrier for user experience.
User has to wait for the unknown... and surpriiise; all at once data bumps out showing on device.
If network is throttling, user needs to be optimistic that data would load successfully.
At times user gets frustrated whether he clicked the button or not. Is there even network?

We are in the moment where UI is not just about showing data to user but counting the experience of your user really help. 

An example is showing a loading icon on a button when user clicks to load
data from server. Often we implement these on/in a single component which creates a rigid scope, less extensibility.
If you need to extend that, you got to sync the state of the request in redux and it becomes universal to your application thereof.

But wait, you have to consider managing the codebase and show consistency across application which is one key feature to a mature user interface and an esteemed user experience.

This could be done purposely and seamlessly with `questrar`.


  
