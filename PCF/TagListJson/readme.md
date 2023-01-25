**TagListJSON** is a virtual PCF control that accepts a text field as the attribute parameter and converts a JSON String into a multicolor Tag control based on style sheets.

Simply add the control on your form and update the form field with a valid JSON format so that it can be rendered properly.

Below is a sample format of how the JSON will appear on the control:

```
{ "Tags": 
  [ 
     { "output": "Phone", "color": "jsonElementInfo" },
     { "output": "Address", "color": "jsonElementInfo" }, 
     { "output": "Email", "color": "jsonElementWarning" }, 
     { "output": "SSN", "color": "jsonElementError" } 
  ] 
}
```

The output on the form should look like this: 

![image](https://user-images.githubusercontent.com/33911954/214471811-341137fc-cf26-4b59-8473-8c6cbcf21ee9.png)

This control is read-only and would be populated most likely by external systems such as Fraud Checks or KYC Checks.
