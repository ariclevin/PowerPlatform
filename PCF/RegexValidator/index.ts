import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class RegexValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _container: HTMLDivElement; 

	private _customAttributeElement: HTMLInputElement;
	private _errorElement: HTMLElement;
	
    // String variable to store the custom attribute value
    private _customAttributeValue: string;

    // Event listener for changes in the custom attribute
	private _customAttributeChanged: EventListenerOrEventListenerObject;
		
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add initialization code
		this._context = context; 
		this._notifyOutputChanged = notifyOutputChanged; 
		this._container = container;
		this._customAttributeChanged = this.customAttributeChanged.bind(this);

		// Design custom attribute Html Input Element
		this._customAttributeElement = document.createElement("input");
		this._customAttributeElement.setAttribute("type", "text");
		this._customAttributeElement.setAttribute("class", "pcfinputcontrol");
		this._customAttributeElement.addEventListener("change", this._customAttributeChanged);

		// Check if Control is Disabled/Read-Only
		var disabled = context.mode.isControlDisabled;
		this._customAttributeElement.disabled = disabled; 


		
		// var currentFormattedValue = context.parameters.CustomControl.formatted ? context.parameters.CustomControl.formatted : "";
		// console.log("Current Value: " + currentValue);
		// console.log("Formatted Value: " + currentFormattedValue);


		var currentValue = context.parameters.CustomControl.raw ? context.parameters.CustomControl.raw : "";
		this._customAttributeElement.setAttribute("value", currentValue);
		this._customAttributeElement.value = currentValue;

		// Add an error visual to show the error message when there is an invalid credit card
		this._errorElement = document.createElement("div");
		this._errorElement.setAttribute("class", "pcferrorcontroldiv");
		var errorChild1 = document.createElement("label");
		errorChild1.setAttribute("class", "pcferrorcontrolimage")
		errorChild1.innerText = "";
		
		var errorChild2 = document.createElement("label");
		errorChild2.setAttribute("class", "pcferrorcontrollabel")
		errorChild2.innerText = "";
		
		this._errorElement.appendChild(errorChild1);
		this._errorElement.appendChild(errorChild2);
		this._errorElement.style.display = "none";

		this._container.appendChild(this._customAttributeElement);
		this._container.appendChild(this._errorElement);  
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		if (context.parameters.CustomControl.raw != null)
			this._customAttributeValue = context.parameters.CustomControl.raw;
		this._context = context;
		this._customAttributeElement.setAttribute("value",context.parameters.CustomControl.formatted ? 
		context.parameters.CustomControl.formatted : "");

		if (this._errorElement.style.display != "none")
		{
			var message: string | null = null;
			if(context.parameters.DefaultErrorMessage != null)
			{
				message = context.parameters.DefaultErrorMessage.raw;
			}
			else
			{
				message = "An unknown error has occured.";
			}

			var type = "ERROR";  //INFO, WARNING, ERROR
			var id = "9444";  //Notification Id
			var time = 5000;  //Display time in milliseconds
				
			// @ts-ignore 
			Xrm.Page.ui.setFormNotification(message, type, id);
			
			//Wait the designated time and then remove the notification
			setTimeout( function () {
			// @ts-ignore 
				Xrm.Page.ui.clearFormNotification(id);
			}, time );		
		}
		
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			CustomControl: this._customAttributeValue
		};
	}

	public customAttributeChanged(evt: Event):void
	{
		var _regEx: RegExp; 
		var isValid = false;
		var context = this._context;
	
		var customAttributeValue = this._customAttributeElement.value;
	
		// Does attribute have a value
		if (customAttributeValue != null && customAttributeValue.length > 0)
		{
			if(context.parameters.RegEx != null)
			{
				if (context.parameters.RegEx.raw != null)
				{
					console.log(context.parameters.RegEx.raw);
					_regEx = new RegExp(context.parameters.RegEx.raw);
					if (_regEx.test(customAttributeValue))
					{
						isValid = true;
					}
				}
			}
	
			// Is the attribute valid?
			if (isValid)
			{
				this._customAttributeValue = customAttributeValue;
				this._errorElement.style.display = "none";
			}
			else 
			{
				this._customAttributeValue = "";
				this._errorElement.style.display = "block";
			}
		}
		else if (customAttributeValue != null && customAttributeValue.length == 0)
		{
			this._customAttributeValue = "";
		}
		else if (customAttributeValue == null)
		{
			this._customAttributeValue = "";
		}
		this._notifyOutputChanged();
	}



	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		this._customAttributeElement.removeEventListener("change", this._customAttributeChanged);

	}
}