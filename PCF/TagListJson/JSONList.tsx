import * as React from 'react';

export interface IJSonListProps {
  title?: string,
  json: string
}

export interface IJSonListState extends React.ComponentState, IJSonListProps { }

export class JSONList extends React.Component<IJSonListProps, IJSonListState> {
  
  public items: any[];

  constructor(props: IJSonListProps) {
      super(props);

      this.items = new Array<any>();

      this.state = {
          title: this.props.title,
          json: this.props.json,
          items: this.items
      };

      this.loadJSON();
  }  
  
  public render(): React.ReactNode {
    return (
      <div className="tagListContainer">
        {this.state.items}
      </div>
    )
  }

  renderJson(jsonData: any) {

    Object.keys(jsonData).forEach(key => 
    {
        let value: any = jsonData[key];
        if (typeof (value) == "object" && value instanceof Array) 
        {
            const title = key;
            value.forEach(item => 
            {
                this.items.push(<span className={item.color}>{item.output}</span>);
            });
        }
    });



    this.setState(
        {
            items: this.items
        });
}

public formatJson(json: string): string {

  if (json) {
      if (json.startsWith("[") && json.endsWith("]"))
          return "{\"\":" + json + "}";
      else
          return json;
  }
  else
      return "{ \"\": \"\" }";

}

loadJSON = () => {
      let data = this.formatJson(this.state.json);
      data = Object.assign({}, JSON.parse(data));
      this.renderJson(data);
  }
}


