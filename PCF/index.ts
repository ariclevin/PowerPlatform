import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { CreditCard, ICreditCardImageProps, ICreditCardProps } from "./CreditCard";
import * as React from "react";
import { IImageProps, ITextFieldProps } from "@fluentui/react";

export class CreditCardControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private _context: ComponentFramework.Context<IInputs>;
    private currentValue: string;
    private defaultValue: string | undefined;
    private notifyOutputChanged: () => void;
    private ccImageProps: ICreditCardImageProps;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void 
    {
        this.defaultValue = context.parameters.CreditCardNumber.formatted;
        this.notifyOutputChanged = notifyOutputChanged;
        this._context = context;

        this.ccImageProps = 
        {
            imageUrlInvalid: this._context.parameters.InvalidCardImageUrl.raw,
            imageUrlVisa: this._context.parameters.VISACardImageUrl.raw,
            imageUrlMasterCard: this._context.parameters.MCCardImageUrl.raw,
            imageUrlDiscover: this._context.parameters.DISCCardImageUrl.raw,
            imageUrlAmericanExpress: this._context.parameters.AMEXCardImageUrl.raw,            
        }

    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {


        const props: ICreditCardProps = { 
            name: 'Credit Card Number Label', 
            ccNumber: this.defaultValue,
            creditCardImages: this.ccImageProps,
            isDisabled: context.mode.isControlDisabled,
            onChange: this.onChange, 
        };

        const textFieldProps: ITextFieldProps = {
            label: 'Credit Card Number',
            value: this._context.parameters.CreditCardNumber.formatted,
            defaultValue: this._context.parameters.CreditCardNumber.formatted,
            maxLength: 16
        };

        this.notifyOutputChanged();

        return React.createElement(
            CreditCard, props, textFieldProps
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            CreditCardNumber: this.currentValue
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

	private onChange = (newValue: string) => {
		this.currentValue = newValue;
        console.log(newValue);
		this.notifyOutputChanged();
	};     
}
