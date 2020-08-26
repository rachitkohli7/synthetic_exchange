import React from "react";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
}));

const AntTab = withStyles((theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  }),
)((props) => <Tab disableRipple {...props} />);

export const TabsComponent = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.demo1}>
        <AntTabs value={props.values.indexOf(props.value)}
          onChange={props.handleChange} aria-label="ant example">
          <AntTab key={props.values[0]} label={props.values[0]} />
          <AntTab key={props.values[1]} label={props.values[1]} />
          <AntTab key={props.values[2]} label={props.values[2]} />
        </AntTabs>
      </div>
  )
}

export default Tabs;
