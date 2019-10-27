/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    NAICSCode: ComponentFramework.PropertyTypes.StringProperty;
    NAICS2Control: ComponentFramework.PropertyTypes.StringProperty;
    NAICS4Control: ComponentFramework.PropertyTypes.StringProperty;
    NAICS6Control: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    NAICSCode?: string;
}
