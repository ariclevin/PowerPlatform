import * as React from 'react';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react';
import { ActionButton, IIconProps, IContextualMenuProps, IconButton } from '@fluentui/react';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react';
import { DefaultPalette } from '@fluentui/react/lib/Styling';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface INotificationItem
{
  notificationId: string,
  notificationTitle: string,
  notificationBody: string,
  notificationCategory: string,
  notificationDate: string | null  
}

export interface INotificationListProps {
  dataset: DataSet,
  publisherPrefix: string | null,
  loadMore: Function,
  openRecord: Function,
  hideRecord: Function,
  resendNotifications: Function,
  executeAction: Function
}

export interface IActionButtonProps 
{
  disabled?: boolean;
  checked?: boolean;
}

// Styles definition
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.neutralLight,
    // height: 200,
    width: "100%"
  },
};
const stackItemStyles: IStackItemStyles = {
  root: {
    alignItems: 'left',
    background: DefaultPalette.neutralLighter,
    color: DefaultPalette.blueDark,
    // display: 'flex',
    justifyContent: 'left',
  },
};

const stackItemActionStyles: IStackItemStyles = {
  root: {
    alignItems: 'right',
    background: DefaultPalette.neutralLight,
    color: DefaultPalette.blueDark,
    justifyContent: 'right',
    borderBottom: 1,
    height: 25
  },
};

// Tokens definition
const outerStackTokens: IStackTokens = { childrenGap: 5 };
const innerStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

const OpenIcon: IIconProps = { iconName: 'OpenInNewTab' };
const SendIcon: IIconProps = { iconName: 'Send' };
const HideIcon: IIconProps = { iconName: 'Hide' };
const ActionIcon: IIconProps = { iconName: 'SetAction' };

/*
const menuProps: IContextualMenuProps = {
  items: [
    {
      key: 'edit',
      text: 'Open Notification',
      iconProps: { iconName: 'OpenInNewTab' },
    },
    {
      key: 'resentNotification',
      text: 'Resend Notifcation',
      iconProps: { iconName: 'Send' },
    },
    {
      key: 'hideNotification',
      text: 'Hide Notification',
      iconProps: { iconName: 'Hide' },
    },
  ],
  directionalHintFixed: true,
};
*/

const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

export class NotificationListControl extends React.Component<INotificationListProps> {

  public render(): React.ReactNode {

    let ds = this.props.dataset; 
    const notifications: INotificationItem[]  = [];

    ds.sortedRecordIds.forEach((item) => {
      notifications.push( { notificationId: ds.records[item].getRecordId(), 
                            notificationTitle: ds.records[item].getFormattedValue(this.props.publisherPrefix + "title"), 
                            notificationBody: ds.records[item].getFormattedValue(this.props.publisherPrefix + "body"), 
                            notificationCategory: ds.records[item].getFormattedValue(this.props.publisherPrefix + "regardingid"), 
                            notificationDate: ds.records[item].getFormattedValue("createdon")}
                            );
    });

    return (
      <Stack tokens={outerStackTokens} className="fullWidth">
        {notifications.map(item => (
        <Stack verticalAlign='stretch' key={item.notificationId} styles={stackStyles} tokens={innerStackTokens}>
        <Stack.Item  align='stretch' key={item.notificationId} styles={stackItemStyles}>
              <div className="notificationHeader">
                <div className="notificationTitle">{item.notificationTitle}</div>  
                <div className="notificationIcons">
                  <TooltipHost content="Open Notification" id='openNotification' calloutProps={calloutProps} styles={hostStyles} >
                    <IconButton iconProps={OpenIcon} aria-label="Open Notification" onClick={() => this.props.openRecord(item.notificationId)} />
                  </TooltipHost>            
                  <TooltipHost content="Resend Notification" id='resendNotification' calloutProps={calloutProps} styles={hostStyles} >
                    <IconButton iconProps={SendIcon} aria-label="Resend Notification" onClick={() => this.props.resendNotifications(item.notificationId)} />
                  </TooltipHost>            
                  <TooltipHost content="Hide Notification" id='hideNotification' calloutProps={calloutProps} styles={hostStyles} >
                    <IconButton iconProps={HideIcon} aria-label="Hide Notification" onClick={() => this.props.hideRecord(item.notificationId)} />
                  </TooltipHost> 
                </div> 
              </div>
              <div className="notificationBody">{item.notificationBody}</div>
              <div className="notificationDate">{item.notificationDate}</div>
          </Stack.Item>
          </Stack>
        ))
        }
      </Stack>
    );
  }
}

