import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import { fade, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ReactJson from 'react-json-view';
import LogLineView from './LogLineView';

const styles = (theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  header: {
    position: 'sticky',
    top: 0,
    width: '100%',
    display: 'flex',
    zIndex: 1100,
    boxSizing: 'border-box',
    flexShrink: 0,
    flexDirection: 'column',
    padding: theme.spacing(1, 2),
    background: '#f7f7f7',
  },
  headerInside: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    minWidth: 120,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  regexFilter: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    marginLeft: 0,
    flexGrow: 1,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  levelFilter: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  expand: {
    display: 'none',
    minWidth: 16,
    [theme.breakpoints.up('md')]: {
      display: 'inherit',
    },
  },
  content: {
    width: 'auto',
    overflowX: 'scroll',
    fontFamily: '"Monaco", monospace',
    fontSize: 12,
    padding: theme.spacing(2, 0),
    whiteSpace: 'pre',
    backgroundColor: 'transparent',
    color: '#222222',
    fontWeight: 400,
    outline: 'none',
  },
  rows: {
    width: 'max-content',
    minWidth: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
})

const LogLevel = {
  'ERROR': { value: 6, string: 'error' },
  'WARN':  { value: 5, string: 'warn' },
  'INFO':  { value: 4, string: 'info' },
  'TRACE': { value: 3, string: 'trace' },
  'DEBUG': { value: 2, string: 'debug' },
  'LOG':   { value: 1, string: 'log' },
}

class LogView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
    this._handleChangeLevelFilter = this._handleChangeLevelFilter.bind(this)
    this._handleChangeRegexFilter = this._handleChangeRegexFilter.bind(this)
  }
  
  _getInitialState() {
    return {
      levelFilter: 'LOG',
      regexFilter: '',
      moreInfoOpen: [],
    }
  }
  
  _handleChangeLevelFilter(event) {
    event.preventDefault()
    this.setState({ levelFilter: event.target.value })
  }
  
  _handleChangeRegexFilter(event) {
    event.preventDefault()
    this.setState({ regexFilter: event.target.value })
  }
  
  render() {
    const { classes, className: classNameProp, log, selected = [], isExpanded = false, expand } = this.props
    const { levelFilter, regexFilter, moreInfoOpen } = this.state
    
    let re = null, regexError = null
    try {
      re = regexFilter !== '' ? new RegExp(regexFilter) : null
    } catch (err) {
      console.error(err)
      regexError = err.message
    }
    
    return (
      <div className="LogView" className={clsx(classes.root, classNameProp)}>
        <Paper>
          <div className={classes.header}>
            <div className={classes.headerInside}>
              <Typography className={classes.title} variant="h6" component="h3">
                Log
              </Typography>
              <div className={classes.regexFilter}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Filter…"
                  value={regexFilter}
                  onChange={this._handleChangeRegexFilter}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <FormControl className={classes.levelFilter}>
                <Select
                  value={levelFilter}
                  onChange={this._handleChangeLevelFilter}
                  inputProps={{
                    name: 'level',
                    id: 'level-filter',
                  }}
                >
                  <MenuItem value={"ERROR"}>ERROR</MenuItem>
                  <MenuItem value={"WARN"}>WARN</MenuItem>
                  <MenuItem value={"INFO"}>INFO</MenuItem>
                  <MenuItem value={"TRACE"}>TRACE</MenuItem>
                  <MenuItem value={"DEBUG"}>DEBUG</MenuItem>
                  <MenuItem value={"LOG"}>LOG</MenuItem>
                </Select>
              </FormControl>
              
              { !isExpanded ?
                <Button className={classes.expand} onClick={() => expand()}><UnfoldMore style={{transform: 'rotate(90deg)'}} /></Button> :
                <Button className={classes.expand} onClick={() => expand()}><UnfoldLess style={{transform: 'rotate(90deg)'}} /></Button> }
            </div>
          </div>
          <div className={classes.content}>
            <div className={classes.rows}>
              { log.map((event) => {
                if (LogLevel[event.level].value >= LogLevel[levelFilter].value
                    && (re ?
                          // test against the one-line log expression
                          (re.exec(`${event.time} ${event.component} ${event.level} ${event.text}`)
                          // test against stringified event.exception if exists
                          || (event.exception && re.exec(`${JSON.stringify(event.exception)}`))
                          // test against stringified event.objects if exists
                          || (event.objects && event.objects.length && re.exec(`${JSON.stringify(event.objects)}`)))
                        : true)) {
                  return (
                    <LogLineView 
                      id={`L${event._key}`} 
                      key={event._key}
                      className={classes.row}
                      event={event}
                      isSelected={selected.includes(event._key)} />
                  )
                } else {
                  return null // ignore this line
                }
              }) }
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

LogView.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  log: PropTypes.array.isRequired,
  selected: PropTypes.array,
  isExpanded: PropTypes.bool,
  expand: PropTypes.func.isRequired,
}

export default withStyles(styles)(LogView)
