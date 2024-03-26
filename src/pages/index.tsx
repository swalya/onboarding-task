import Column from "@/components/index/Column/Column";
import { ArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Styles from "../styles/Home.module.css";

import GET_COLUMNS from "@/graphql/queries/GetColumns.gql";
import CREATE_COLUMN from "@/graphql/mutations/CreateColumn.gql";

export default function Home() {
  const [showAddColumnForm, setShowAddColumnForm] = useState(false);
  const [columnNameInput, setColumnNameInput] = useState("");
  const [columnNameInputErr, setColumnNameInputErr] = useState("");

  const {
    data,
    loading,
    error,
    refetch: refetchColumns,
  } = useQuery(GET_COLUMNS);

  const [
    createColumnsMutation,
    { data: addColData, loading: addColLoad, error: addColErr },
  ] = useMutation(CREATE_COLUMN, {
    variables: { columnName: columnNameInput },
    onCompleted: () => {
      refetchColumns();
      setColumnNameInput("");
    },
  });

  const handleAddColumn = () => {
    if (columnNameInput) {
      setColumnNameInputErr("");
      createColumnsMutation();
    }
  };

  return (
    <>
      <Head>
        <title>Kanban Board</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="xl" className={Styles.Container}>
        <Typography variant="h5" fontWeight="bold" color="black">
          Kanban
        </Typography>
        <Stack spacing={2} direction="row">
          <Typography color="black">Dashboard</Typography>
          <ArrowRight color="primary" />
          <Typography fontWeight="bold" color="black">
            Kanban
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} marginTop={2}>
          {data?.columns?.map((column: any) => (
            <Column
              column={column}
              refetchColumns={refetchColumns}
              key={column.id}
            />
          ))}

          {data?.columns?.length < 5 && (
            <Card
              sx={{ width: "100%", height: "fit-content", maxWidth: "300px" }}
            >
              <CardContent>
                {!showAddColumnForm && (
                  <Button fullWidth onClick={() => setShowAddColumnForm(true)}>
                    Add Column
                  </Button>
                )}
                {showAddColumnForm && (
                  <Box>
                    <TextField
                      fullWidth
                      id="card-name"
                      variant="outlined"
                      label="Name"
                      value={columnNameInput}
                      onChange={(e) => setColumnNameInput(e.target.value)}
                      error={Boolean(columnNameInputErr)}
                    />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ marginTop: 2 }}
                    >
                      <Button
                        onClick={() => {
                          setColumnNameInput("");
                          setShowAddColumnForm(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleAddColumn()}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {data?.columns?.length > 4 && (
            <Typography className={Styles.MaxColumnMessage}>
              You have reached limit for creating columns
            </Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}