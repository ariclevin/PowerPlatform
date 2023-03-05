/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    buttonAttribute: ComponentFramework.PropertyTypes.StringProperty;
    buttonText: ComponentFramework.PropertyTypes.StringProperty;
    buttonStatus: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    buttonIcon: ComponentFramework.PropertyTypes.StringProperty;
    buttonType: ComponentFramework.PropertyTypes.EnumProperty<"Default" | "Compound">;
    buttonStyle: ComponentFramework.PropertyTypes.EnumProperty<"Standard" | "Primary">;
    secondaryText: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    buttonAttribute?: string;
}
