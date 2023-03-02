import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { NotificationListControl, INotificationListProps, IActionButtonProps } from "./NotificationList";
import * as React from "react";

export class NotificationList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    public _context: ComponentFramework.Context<IInputs>;
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
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        // let dataSet = context.parameters.notificationDataSet;

    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: INotificationListProps = { dataset: context.parameters.notificationDataSet, 
                                                publisherPrefix: context.parameters.publisherPrefix.raw!,
                                                openRecord: this.openRecord,
                                                hideRecord: this.deactivateRecord,
                                                resendNotifications: this.resendRecordNotifications,
                                                executeAction: this.executeAction
                                            };
        const iconProps: IActionButtonProps = { disabled: false, checked: false };
        return React.createElement(
            NotificationListControl, props, iconProps
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private executeAction(actionType: string, id: string)
    {
        alert(actionType);
        alert(id);
    }

	private openRecord(id:string){
        console.log("Open Record: " + id);
		let entityName:string = this._context.parameters.notificationDataSet.getTargetEntityType();
        // let entityName:string = this.dataset.getTargetEntityType();
        console.log("Entity Name: " + entityName);

		let entityFormOptions = {
			entityName:  entityName,
			entityId: id
		};
		
		this._context.navigation.openForm(entityFormOptions);
	}    
   
    private deactivateRecord(id:string)
    {
        console.log("Deactivate Record: " + id);
        let entityName:string = this._context.parameters.notificationDataSet.getTargetEntityType();
        console.log("Entity Name: " + entityName);

        let data = 
        {
            "statecode": 1,
            "statuscode": 2        
        }

        this._context.webAPI.updateRecord(entityName, id, data).then(
            function success(result)
            {
                console.log(id + " hidden");
            },
            function (error)
            {
                console.log(error.message);
            }
        )
    }

    private resendRecordNotifications(id:string)
    {
        console.log("Resend Record: " + id);
        let entityName:string = this._context.parameters.notificationDataSet.getTargetEntityType();
        console.log("Entity Name: " + entityName);

        let fieldName = this._context.parameters.publisherPrefix.raw! + "fieldName";
        let data = 
        {
            fieldName: 1
        }

        this._context.webAPI.updateRecord(entityName, id, data).then(
            function success(result)
            {
                console.log(id + " being resent");
            },
            function (error)
            {
                console.log(error.message);
            }
        )
    }

}
