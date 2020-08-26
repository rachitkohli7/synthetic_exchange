import React from 'react';
import { TabsComponent } from 'components/TabsComponent';


const TradeTypeTabs = (props) => {
    return (
        <TabsComponent value={props.value} values={props.values} handleChange={props.handleChange}/>
    );
};

export default TradeTypeTabs;