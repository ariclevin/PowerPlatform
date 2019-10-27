import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { ENGINE_METHOD_DIGESTS } from "constants";

export class PCFNaicsCodeSplitter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _container: HTMLDivElement;	
	
	private _naicsCodeElement: HTMLInputElement;
	private _naicsCodeErrorElement: HTMLElement

	private _naicsCodeChanged: EventListenerOrEventListenerObject;
	private _naics6id: string;

	private _naics2FieldName: string | null;
	private _naics4FieldName: string | null;
	private _naics6FieldName: string | null;

	constructor()
	{

	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._context = context; 
		this._notifyOutputChanged = notifyOutputChanged; 
		this._container = container;

		this._naicsCodeChanged = this.naicsCodeChanged.bind(this);

		// textbox control
		this._naicsCodeElement = document.createElement("input");
		this._naicsCodeElement.setAttribute("type", "text");
		this._naicsCodeElement.setAttribute("placeholder", "Enter a 6 Digit NAICS Code");
		this._naicsCodeElement.setAttribute("class", "pcfinputcontrol");
		this._naicsCodeElement.addEventListener("change", this._naicsCodeChanged);

		this._naicsCodeErrorElement = document.createElement("div");
		this._naicsCodeErrorElement.setAttribute("class", "pcferrorcontroldiv");
		var naicsErrorChild1 = document.createElement("label");
		naicsErrorChild1.setAttribute("class", "pcferrorcontrolimage")
		naicsErrorChild1.innerText = "";

		var naicsErrorChild2 = document.createElement("label");
		naicsErrorChild2.setAttribute("id", "errorelementlabelid");
		naicsErrorChild2.setAttribute("class", "pcferrorcontrollabel");
		naicsErrorChild2.innerText = "Invalid NAICS Code Entered";

		this._naicsCodeErrorElement.appendChild(naicsErrorChild1);
		this._naicsCodeErrorElement.appendChild(naicsErrorChild2);
		this._naicsCodeErrorElement.style.display = "none";

		this._container.appendChild(this._naicsCodeElement);
		this._container.appendChild(this._naicsCodeErrorElement);	

		this._naics2FieldName = context.parameters.NAICS2Control.raw;
		this._naics4FieldName = context.parameters.NAICS4Control.raw;
		this._naics6FieldName = context.parameters.NAICS6Control.raw;

		this._naics2FieldName != null ? console.log(this._naics2FieldName) : console.log("Naics2FieldName is Null");
		this._naics4FieldName != null ? console.log(this._naics4FieldName) : console.log("Naics4FieldName is Null");
		this._naics6FieldName != null ? console.log(this._naics6FieldName) : console.log("Naics6FieldName is Null");
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view

		// Display Error
		if (this._naicsCodeErrorElement.style.display != "none")
		{
			var message = "The NAICS COde  is not valid.";
			var type = "ERROR";  //INFO, WARNING, ERROR
			var id = "9443";  //Notification Id
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

	private RetrieveNAICSReferences(naicsCode : string) {
		debugger
		var entityName = "cdsp_naics6title";
		var retrieveMultipleOptions = "?$select=_cdsp_naics2_value,_cdsp_naics4_value,cdsp_naics6titleid,cdsp_title&$filter=cdsp_number eq '" + naicsCode + "'";
		// var retrieveMultipleOptions = "?$select=cdsp_naics6titleid,cdsp_title&$filter=cdsp_code eq '" + naicsCode + "'";
		var thisRef = this;
		this._context.webAPI.retrieveMultipleRecords(entityName, retrieveMultipleOptions).then(function (results: any) {
			for (let entity of results.entities) {
				var naics2Value = entity["_cdsp_naics2_value"];
				var naics2Text = entity["_cdsp_naics2_value@OData.Community.Display.V1.FormattedValue"];

				var naics4Value = entity["_cdsp_naics4_value"];
				var naics4Text = entity["_cdsp_naics4_value@OData.Community.Display.V1.FormattedValue"];
				
				var naics6Value = entity["cdsp_naics6titleid"];
				var naics6Text = entity["cdsp_title"];

				console.log(naics2Value);
				console.log(naics2Text)
				console.log(naics4Value);
				console.log(naics4Text)
				console.log(naics6Value);
				console.log(naics6Text)

				// @ts-ignore
				Xrm.Page.getAttribute(thisRef._naics2FieldName).setValue([{ id: naics2Value, name: naics2Text, entityType: "cdsp_naics2industry" }]);

				// @ts-ignore
				Xrm.Page.getAttribute(thisRef._naics4FieldName).setValue([{ id: naics4Value, name: naics4Text, entityType: "cdsp_naics4subsector" }]);

				// @ts-ignore
				Xrm.Page.getAttribute(thisRef._naics6FieldName).setValue([{ id: naics6Value, name: naics6Text, entityType: "cdsp_naics6title" }]);
				break;
			}
		}, function (error) {
			thisRef._context.navigation.openAlertDialog(error.message);
			return [];
		});
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			NAICSCode: this._naics6id
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		this._naicsCodeElement.removeEventListener("change", this._naicsCodeChanged);
	}

	public naicsCodeChanged(evt: Event):void
	{
		var naicsCode = this._naicsCodeElement.value;
		console.log(naicsCode);
		this.RetrieveNAICSReferences(naicsCode);
		this._notifyOutputChanged();
	}
}