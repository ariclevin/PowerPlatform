/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    CreditCardNumber: ComponentFramework.PropertyTypes.StringProperty;
    InvalidCardImageUrl: ComponentFramework.PropertyTypes.StringProperty;
    VISACardImageUrl: ComponentFramework.PropertyTypes.StringProperty;
    MCCardImageUrl: ComponentFramework.PropertyTypes.StringProperty;
    DISCCardImageUrl: ComponentFramework.PropertyTypes.StringProperty;
    AMEXCardImageUrl: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    CreditCardNumber?: string;
}
