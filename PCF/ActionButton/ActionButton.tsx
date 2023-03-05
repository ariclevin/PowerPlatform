import * as React from 'react';
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react';
import { IIconProps } from '@fluentui/react';


export interface IActionButtonProps {
  displayName?: string;
  secondaryText?: string;
  buttonType?: string;
  buttonStyle?: string;
  buttonIcon?: string;
  onChange: () => void;
  buttonStatus?: boolean;
}


export class ActionButtonControl extends React.Component<IActionButtonProps> {
  public render(): React.ReactNode {
    const actionButtonIcon: IIconProps = { iconName: this.props.buttonIcon };

    switch(this.props.buttonType)
    {
      case "Default":
        if (this.props.buttonStyle == "Standard")
        { 
          return (
            <div>
              <DefaultButton iconProps={actionButtonIcon} text={this.props.displayName} onClick={this.props.onChange} disabled={this.props.buttonStatus}></DefaultButton>
            </div>
          )  
        }
        else
        {
          return (
            <div>
              <PrimaryButton iconProps={actionButtonIcon} text={this.props.displayName} onClick={this.props.onChange} disabled={this.props.buttonStatus}></PrimaryButton>
            </div>
          )  
        }
      case "Compound":
        if (this.props.buttonStyle == "Standard")
        {         
          return (
            <div>
              <CompoundButton secondaryText={this.props.secondaryText} onClick={this.props.onChange} disabled={this.props.buttonStatus}>{this.props.displayName}</CompoundButton>
            </div>
          )
        }
        else
        {
          return (
            <div>
              <CompoundButton primary secondaryText={this.props.secondaryText} onClick={this.props.onChange} disabled={this.props.buttonStatus}>{this.props.displayName}</CompoundButton>
            </div>
          )         
        }
      default:
        if (this.props.buttonStyle == "Standard")
        { 
          return (
            <div>
              <DefaultButton iconProps={actionButtonIcon} text={this.props.displayName} onClick={this.props.onChange} disabled={this.props.buttonStatus}></DefaultButton>
            </div>
          )  
        }
        else
        {
          return (
            <div>
              <PrimaryButton iconProps={actionButtonIcon} text={this.props.displayName} onClick={this.props.onChange} disabled={this.props.buttonStatus}></PrimaryButton>
            </div>
          )  
        }
    }
  }
}
