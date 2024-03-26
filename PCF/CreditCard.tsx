import * as React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { TextField, ITextFieldProps } from '@fluentui/react/lib/TextField';
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';
import { Stack, IStackProps, IStackStyles, IStackTokens } from '@fluentui/react/lib/Stack'; 
// import {  } from "./index";
import { useId } from '@fluentui/react-hooks';
import { text } from 'stream/consumers';
import { getPropsWithDefaults } from '@fluentui/react';

export interface ICreditCardProps {
  name?: string;
  ccNumber?: string,
  creditCardImages: ICreditCardImageProps,
  isDisabled: boolean,
  onChange: (value: string) => void;
}

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

const imageProps: IImageProps = {
  imageFit: ImageFit.none,
  width: 38,
  height: 24,
  
};

const textFieldProps: ITextFieldProps = {
  // label: 'Credit Card Number',
  defaultValue: "0000000000000000",
};

export interface ICreditCardImageProps {
  imageUrlInvalid: string | null,
  imageUrlVisa: string | null,
  imageUrlMasterCard: string | null,
  imageUrlDiscover: string | null,
  imageUrlAmericanExpress: string | null  
}

// id: useId("txtCreditCardNumber")

var creditCardImage = 'https://bgx.blob.core.windows.net/shared/imgs/ico/redwarning.png';

const getOnChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
  
  getCreditCardImage(newValue);
}

const getCreditCardImage = (newValue?: string): void => {
  if (newValue !== undefined)
  { 
    var creditCardNumberText = newValue as string;
    if (creditCardNumberText.length >= 13 && creditCardNumberText.length <= 16)
    {
        if (creditCardNumberText.length == 15 && (creditCardNumberText.substring(0, 2) === "34" || creditCardNumberText.substring(0, 2) === "37"))
        creditCardImage =  "https://bgx.blob.core.windows.net/shared/imgs/ico/amex24.png"; 
        else if (creditCardNumberText.substring(0, 1) === "4" && (creditCardNumberText.length == 13 || creditCardNumberText.length == 16))
        creditCardImage = "https://bgx.blob.core.windows.net/shared/imgs/ico/visa24.png";
        else if (creditCardNumberText.substring(0, 4) === "6011" && creditCardNumberText.length == 16)
        creditCardImage = "https://bgx.blob.core.windows.net/shared/imgs/ico/disc24.png";
        else if (parseInt(creditCardNumberText.substring(0, 2)) > 50 && parseInt(creditCardNumberText.substring(0, 2)) < 56 && creditCardNumberText.length == 16)
        creditCardImage = "https://bgx.blob.core.windows.net/shared/imgs/ico/mc24.png";
        else
        creditCardImage ="https://bgx.blob.core.windows.net/shared/imgs/ico/redwarning.png";
    }
    else
    {
      creditCardImage = "https://bgx.blob.core.windows.net/shared/imgs/ico/redwarning.png";
    }
  }
  imageProps.src = creditCardImage;
  // console.log(creditCardImage);  
}

const getErrorMessage = (creditCardNumber: string): string => {
  var errorMessage = '';
  if (creditCardNumber.length >= 13)
  {
    switch(creditCardNumber.length)
    {
      case 13:
        if (creditCardNumber.substring(0,1) !== "4")
        {
          errorMessage = "Visa credit card numbers of 13 digits begin with the number 4";
        }
        break;
      case 15:
        if (creditCardNumber.substring(0,2) !== "34" && creditCardNumber.substring(0,2) !== "37")
        {
          errorMessage = "AMEX credit card numbers must begin with 34 or 37";
        }
        break;
      case 16:
        if (creditCardNumber.substring(0,1) !== "4" && creditCardNumber.substring(0,1) !== "5" && creditCardNumber.substring(0,4) !== "6011")
        {
          errorMessage = "The credit card number you entered is not valid";
        }
        break;
    }
  }
  else
  {
    errorMessage = 'Credit Card Numbers must be at least 13 digits';
  }
  
  return errorMessage;
};


export class CreditCard extends React.Component<ICreditCardProps, IImageProps, ITextFieldProps> {
 
  renderLabel()
  {
    return (
      <Label>Credit Card Number</Label>
    )
  }

  renderTextField()
  {
    return ( 
      <TextField 
      {...textFieldProps}
      onChange={getOnChange}
      onGetErrorMessage={getErrorMessage}
    ></TextField>
    )
  }


  renderImage()
  {
    // console.log(textFieldProps.value);
   
    getCreditCardImage(textFieldProps.value);

    return (
      <Image
      {...imageProps}
      src={creditCardImage}
      alt='Credit Card Type'/>
    )
  }

  public render(): React.ReactNode {

    return (
      <Stack horizontal disableShrink tokens={horizontalGapStackTokens}>
        <Stack.Item grow disableShrink>
          {this.renderTextField()}          
        </Stack.Item>
        <Stack.Item>
          {this.renderImage()}  
        </Stack.Item>

      </Stack>
    )
  }
}
