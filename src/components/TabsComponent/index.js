import React from "react";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import {default as colors} from 'styles/theme/colors';

const AntTabs = withStyles({
  root: {
    borderBottom: 'transparent',
  },
  indicator: {
    backgroundColor: colors.buttonDefault,
  },
})(Tabs);

const useStyles = makeStyles((theme) => ({
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AntTab = withStyles((theme) =>
  createStyles({
    root: {
      textTransform: 'upperCase',
      minWidth: 40,
      paddingBottom: 0,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover': {
        color: colors.buttonHover,
        opacity: 1,
      },
      '&$selected': {
        color: colors.buttonDefault,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: colors.buttonDefault,
      },
    },
    selected: {},
  }),
)((props) => <Tab disableRipple {...props} />);

export const TabsComponent = (props) => {
  const classes = useStyles();
  return (
    <div >
        <AntTabs value={props.values.indexOf(props.value)}
          onChange={props.handleChange} aria-label="Trade type tabs">
          <AntTab key={props.values[0]} label={props.values[0]} />
          <AntTab key={props.values[1]} label={props.values[1]} />
          <AntTab key={props.values[2]} label={props.values[2]} />
        </AntTabs>
      </div>
  )
}

export default Tabs;
