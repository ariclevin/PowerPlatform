import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PCFCreditCardValidator implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Required private parameters of the control
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _container: HTMLDivElement;	

	// HTML Elements that will be used in the control
	private _creditCardNumberElement: HTMLInputElement;
	private _creditCardTypeElement: HTMLElement;
	private _creditCardErrorElement: HTMLElement;

	// String variable to store the credit card number
	private _creditCardNumber: string;

	// Event listener for changes in the credit card number
	private _creditCardNumberChanged: EventListenerOrEventListenerObject;

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
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// assigning environment variables. 
        this._context = context; 
        this._notifyOutputChanged = notifyOutputChanged; 
        this._container = container;
		
		// Add control initialization code
		this._creditCardNumberChanged = this.creditCardChanged.bind(this);
		
		// Add the textbox control, styling and event listener
		this._creditCardNumberElement = document.createElement("input");
		this._creditCardNumberElement.setAttribute("type", "text");
		this._creditCardNumberElement.setAttribute("class", "pcfinputcontrol");
		this._creditCardNumberElement.addEventListener("change", this._creditCardNumberChanged);
		
		// Add the image control that will display the logo of the credit card
		this._creditCardTypeElement = document.createElement("img");
		this._creditCardTypeElement.setAttribute("class", "pcfimagecontrol");
		this._creditCardTypeElement.setAttribute("height", "24px");
		
		// Add an error visual to show the error message when there is an invalid credit card
		this._creditCardErrorElement = document.createElement("div");
		this._creditCardErrorElement.setAttribute("class", "pcferrorcontroldiv");
		var creditCardErrorChild1 = document.createElement("label");
		creditCardErrorChild1.setAttribute("class", "pcferrorcontrolimage")
		creditCardErrorChild1.innerText = "";

		var creditCardErrorChild2 = document.createElement("label");
		creditCardErrorChild2.setAttribute("class", "pcferrorcontrollabel")
		creditCardErrorChild2.innerText = "Invalid Credit Card Number entered.";

		this._creditCardErrorElement.appendChild(creditCardErrorChild1);
		this._creditCardErrorElement.appendChild(creditCardErrorChild2);
		this._creditCardErrorElement.style.display = "none";

		this._container.appendChild(this._creditCardNumberElement);
		this._container.appendChild(this._creditCardTypeElement);	
		this._container.appendChild(this._creditCardErrorElement);	
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		debugger
		
		// @ts-ignore
		var crmCreditCardNumberAttribute = this._context.parameters.CreditCardNumber.attributes.LogicalName;
		
		 // @ts-ignore 
		Xrm.Page.getAttribute(crmCreditCardNumberAttribute).setValue(this._context.parameters.CreditCardNumber.formatted);
		
		if (this._creditCardErrorElement.style.display != "none")
		{
			var message = "The credit card number is not valid.";
			var type = "ERROR";  //INFO, WARNING, ERROR
			var id = "9444";  //Notification Id
			var time = 4000;  //Display time in milliseconds
			
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
			CreditCardNumber: this._creditCardNumber
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		this._creditCardNumberElement.removeEventListener("change", this._creditCardNumberChanged);
	}
	
	public creditCardChanged(evt: Event):void
	{
		// Variable declarations	
		var _regEx: RegExp | null = null;
		var imageUrl = "";
		var isValid = false;

		var creditCardNumber = this._creditCardNumberElement.value;

		// Does Credit Card have a value
		if (creditCardNumber != null && creditCardNumber.length > 0)
        {
			// Is this a Visa card?
			_regEx = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
			if (_regEx.test(creditCardNumber))
			{
				isValid = true;
				imageUrl = "https://bgx.blob.core.windows.net/shared/imgs/ico/visa24.png";
			}

			if (!isValid)
			{
				// Mastercard
				_regEx = new RegExp('^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$');
				if (_regEx.test(creditCardNumber))
				{
					isValid = true;
					imageUrl = "https://bgx.blob.core.windows.net/shared/imgs/ico/mc24.png";
				}
			}

			if (!isValid)
			{
				// American Express
				_regEx = new RegExp('^3[47][0-9]{13}$');
				if (_regEx.test(creditCardNumber))
				{
					isValid = true;
					imageUrl = "https://bgx.blob.core.windows.net/shared/imgs/ico/amex24.png";
				}
			}

			if (!isValid)
			{
				// Discover
				_regEx = new RegExp('6(?:011|5[0-9]{2})[0-9]{12}');
				if (_regEx.test(creditCardNumber))
				{
					isValid = true;
					imageUrl = "https://bgx.blob.core.windows.net/shared/imgs/ico/disc24.png";
				}
			}


			if (isValid)
			{
				this._creditCardTypeElement.setAttribute("src", imageUrl);
				this._creditCardNumber = creditCardNumber;
				this._creditCardErrorElement.style.display = "none";
			}
			else
			{
				this._creditCardTypeElement.setAttribute("src", "https://bgx.blob.core.windows.net/shared/imgs/ico/redwarning.png");
				this._creditCardNumberElement.removeAttribute("src");
				this._creditCardNumber = "";
				this._creditCardErrorElement.style.display = "block";
			}
		}
		this._notifyOutputChanged();
	}
	
}