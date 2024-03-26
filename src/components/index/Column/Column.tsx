import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    TextField,
  } from "@mui/material";
  import { useState } from "react";
  import BoardCard from "../boardCard/BoardCard";
  import PropTypes from "prop-types";
  import { useDrop } from "react-dnd";
  import { useMutation } from "@apollo/client";
  
  import Styles from "./Column.module.css";
  
  import CREATE_CARD from "@/graphql/mutations/CreateTask.gql";
  import MOVE_TASK from "@/graphql/mutations/MoveTask.gql";
  import BoardHeader from "../boardHeader/BoardHeader";
  
  const Column = (props: any) => {
    const { column, refetchColumns } = props;
  
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [cardNameInput, setCardNameInput] = useState("");
  
    const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: "Card",
      drop: (item: any) => {
        moveCardMutation({
          variables: { newColumnId: column.id, taskId: item.id },
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });
  
    const [moveCardMutation, { loading: moveCardLoading, error: moveCardErr }] =
      useMutation(MOVE_TASK, {
        onCompleted: () => {
          refetchColumns();
        },
      });
  
    const [
      createCardMutation,
      { data: addColData, loading: addColLoad, error: addColErr },
    ] = useMutation(CREATE_CARD, {
      variables: { taskName: cardNameInput, columnId: column.id },
      onCompleted: () => {
        setCardNameInput("");
        setShowAddCardForm(false);
        refetchColumns();
      },
    });
  
    return (
      <Card className={Styles.Container}>
        <BoardHeader column={column} refetchColumns={refetchColumns} />
  
        <CardContent className={Styles.CardContent}>
          <Box ref={dropRef} minHeight={40}>
            {column?.tasks?.map((task: any) => (
              <BoardCard
                card={task}
                key={task.id}
                refetchColumns={refetchColumns}
              />
            ))}
          </Box>
        </CardContent>
  
        {showAddCardForm && (
          <CardContent>
            <Box sx={{ marginBottom: 2, marginTop: 2 }}>
              <TextField
                fullWidth
                id="card-name"
                variant="outlined"
                label="Title"
                value={cardNameInput}
                onChange={(e) => setCardNameInput(e.target.value)}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginTop: 2 }}
              >
                <Button
                  onClick={() => {
                    setCardNameInput("");
                    setShowAddCardForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (cardNameInput) {
                      createCardMutation();
                    } else {
                    }
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </CardContent>
        )}
  
        {!showAddCardForm && (
          <CardActions>
            <Button fullWidth onClick={() => setShowAddCardForm(true)}>
              Add Task
            </Button>
          </CardActions>
        )}
      </Card>
    );
  };
  
  Column.propTypes = {
    column: PropTypes.object.isRequired,
    refetchColumns: PropTypes.func.isRequired,
  };
  
  export default Column;