import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { CancelOutlined, CheckCircle, MoreHoriz } from "@mui/icons-material";
import PropTypes from "prop-types";

import RENAME_COLUMN from "@/graphql/mutations/RenameColumn.gql";
import CLEAR_COLUMN from "@/graphql/mutations/ClearColumn.gql";
import DELETE_COLUMN from "@/graphql/mutations/DeleteColumn.gql";
import BoardDialog from "@/components/board/BoardDialog";

const BoardHeader = (props: any) => {
  const { column, refetchColumns } = props;

  const [renameInput, setRenameInput] = useState(column.title);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const moreMenuRef = useRef(null);

  const [
    renameColumnMutation,
    { loading: renameColLoading, error: renameColErr },
  ] = useMutation(RENAME_COLUMN, {
    variables: { newName: renameInput, columnId: column.id },
    onCompleted: () => {
      setRenameInput("");
      setShowRenameForm(false);
      refetchColumns();
    },
  });

  const [
    clearColumnMutation,
    { loading: clearColLoading, error: clearColErr },
  ] = useMutation(CLEAR_COLUMN, {
    variables: { columnId: column.id },
    onCompleted: () => {
      refetchColumns();
    },
  });

  const [
    deleteColumnMutation,
    { loading: deleteColLoading, error: deleteColErr },
  ] = useMutation(DELETE_COLUMN, {
    variables: { columnId: column.id },
    onCompleted: () => {
      refetchColumns();
    },
  });

  return (
    <>
      {showRenameForm && (
        <CardHeader
          title={
            <TextField
              value={renameInput}
              size="small"
              title=""
              variant="standard"
              onChange={(e) => setRenameInput(e.target.value)}
              autoFocus
            />
          }
          action={
            <>
              <IconButton
                onClick={() => {
                  if (renameInput) {
                    renameColumnMutation();
                  } else {
                  }
                }}
                ref={moreMenuRef}
                aria-label="Save"
              >
                <CheckCircle />
              </IconButton>
              <IconButton
                onClick={() => setShowRenameForm(false)}
                ref={moreMenuRef}
                aria-label="Cancel"
              >
                <CancelOutlined />
              </IconButton>
            </>
          }
        />
      )}

      {!showRenameForm && (
        <CardHeader
          title={column.name}
          action={
            <>
              <IconButton
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                ref={moreMenuRef}
                aria-label="Actions"
              >
                <MoreHoriz />
              </IconButton>

              <Menu
                open={moreMenuOpen}
                anchorEl={moreMenuRef.current}
                onClose={() => setMoreMenuOpen(false)}
              >
                <MenuItem
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setShowRenameForm(true);
                  }}
                >
                  Rename
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setClearModalOpen(true);
                  }}
                >
                  Clear
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          }
        />
      )}

      <BoardDialog
        open={clearModalOpen}
        title="Clear items."
        message={`Do you want to clear all items on ${column.title} column.`}
        onClose={() => setClearModalOpen(false)}
        onConfirm={() => {
          clearColumnMutation();
          setClearModalOpen(false);
        }}
      />

      <BoardDialog
        open={deleteModalOpen}
        title="Delete column."
        message={`Delete ${column.title} column? All items on the column will be deleted too.`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          deleteColumnMutation();
          setDeleteModalOpen(false);
        }}
      />
    </>
  );
};

BoardHeader.propTypes = {
  column: PropTypes.object.isRequired,
  refetchColumns: PropTypes.func.isRequired,
};

export default BoardHeader;