import { IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { Delete } from "@mui/icons-material";

import Styles from "./BoardCard.module.css";
import BoardDialog from "@/components/board/BoardDialog";
import { useState } from "react";
import { useMutation } from "@apollo/client";

import DELETE_CARD from "@/graphql/mutations/DeleteTask.gql";

const BoardCard = (props: any) => {
  const { card, refetchColumns } = props;

  const [deleteCardDialogOpen, setDeleteCardDialogOpen] = useState(false);

  const [deleteCardMutation] = useMutation(DELETE_CARD, {
    onCompleted: () => refetchColumns(),
  });

  const [{ opacity }, dragRef] = useDrag(() => ({
    item: card,
    type: "Card",
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  }));

  return (
    <>
      <div ref={dragRef} className={Styles.Container}>
        <Typography>{card?.name}</Typography>
        <IconButton
          className={Styles.DeleteIcon}
          onClick={() => {
            setDeleteCardDialogOpen(true);
          }}
        >
          <Delete color="error" />
        </IconButton>
      </div>

      <BoardDialog
        message={`Delete Task: ${card?.name}`}
        title="Delete Card?"
        open={deleteCardDialogOpen}
        onConfirm={() => {
          deleteCardMutation({
            variables: {
              taskId: card.id,
            },
          });
        }}
        onClose={() => setDeleteCardDialogOpen(false)}
      />
    </>
  );
};

BoardCard.propTypes = {
  card: PropTypes.object.isRequired,
  refetchColumns: PropTypes.func.isRequired,
};

export default BoardCard;