import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HelpIcon from '@material-ui/icons/Help';
import { green } from '@material-ui/core/colors';

class CauseView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
  }
  
  _getInitialState() {
    return {
      isOpen: false
    }
  }

  _handleClickOpen() {
    this.setState({ isOpen: true });
  }

  _handleClickClose() {
    this.setState({ isOpen: false });
  }

  render() {
    const { message, cause, ...props } = this.props;

    return (
        <span>
          <Link color="inherit" onClick={() => this._handleClickOpen()}>
            <HelpIcon style={{ fontSize: 18, color: green[500] }} />
            {message}
          </Link>
          <Dialog
            open={this.state.isOpen}
            onClose={() => this._handleClickClose()}
            fullWidth={true}
            maxWidth="lg"
          >
            <DialogTitle>{ message }</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <div dangerouslySetInnerHTML={{ __html: cause }} />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this._handleClickClose()} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </span>
    );
  }
}

CauseView.propTypes = {
  message: PropTypes.string,
  cause: PropTypes.string,
}

export default CauseView;
