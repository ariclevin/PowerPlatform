The Action Button PCF is a virtual control that allows adding an Action button to a Model Driven app. 
The action button can have various options for look and feel and can be customized as well.

## Button Properties
The following are the properties of the action button

| Property | Description |
| ------ | ------ |
| buttonAttribute | The attribute associated with the Action button |
| buttonText | The text that will be dislayed on the button. |
| buttonStatus | The two options field that is associated with display status of the button |
| buttonIcon | The name of the Icon that will be displayed next to the button (for default button only) |
| buttonType | Option to select a default button or a compound button |
| buttonStyle | The type of button that will be displayed (Standard or Primary) |
| secondaryText | Secondary text that will be displayed for Compound buttons |


## Button Options
The following images show the different options for displaying the buttons

> **Primary button**

![image](https://user-images.githubusercontent.com/33911954/222940093-798e6ca5-0906-4902-baa8-4e35581dac43.png)

> **Primary button with Icon**

![image](https://user-images.githubusercontent.com/33911954/222940121-525fdc77-f58a-44f6-b781-078126491e7c.png)

> **Standard button**

![image](https://user-images.githubusercontent.com/33911954/222940155-7113f69a-46ef-41de-a1df-09c80fb283a3.png)

> **Standard button with Icon**

![image](https://user-images.githubusercontent.com/33911954/222940138-1098287f-50c8-4cc1-8e94-ef9c028789fe.png)

> **Compound Primary button**

![image](https://user-images.githubusercontent.com/33911954/222940200-40f63c9a-c838-47f8-a923-3eef524875ca.png)

> **Compound Standard button**

![image](https://user-images.githubusercontent.com/33911954/222940214-eb0f37f9-4ef6-4869-887f-51e3f3bb870a.png)

> **Disabled button**

![image](https://user-images.githubusercontent.com/33911954/222940234-df5aff10-bea7-4d6c-96f3-3b2467b34a41.png)

## Add code to the click event of the button
The click event of the button is simply added to the placeholder control of the text field that the button control is displayed on.
Below is a sample of the click event that will open a new window when the button is clicked. 


    function  OpenApplication(executionContext) {
       var openUrlOptions = { height: 800, width: 800 }; 
       Xrm.Navigation.openUrl("https://www.microsoft.com", openUrlOptions) 
    }


