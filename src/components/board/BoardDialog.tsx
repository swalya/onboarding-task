import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
  } from "@mui/material";
  import { TransitionProps } from "@mui/material/transitions";
  import PropTypes from "prop-types";
  import { forwardRef } from "react";
  
  const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const BoardDialog = (props: any) => {
    const { title, message, onClose, onConfirm, open } = props;
  
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  BoardDialog.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };
  
  export default BoardDialog;