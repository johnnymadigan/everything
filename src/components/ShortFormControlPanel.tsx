"use client";
import { ShortFormModel, ShortFormModelSchema } from "@/models/ShortFormModel";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button, Checkbox } from "@mui/material";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button73 from "./Button73";
import CustomSwitch from "./CustomSwitch";
import CustomTooltip from "./CustomTooltip";

type ShortFormControlPanelProps = {
  isSubmitDisabled?: boolean;
  isResetDisabled?: boolean;
  isFastForm: boolean;
  isForceSkeleton: boolean;
  isForceFailDuringSubmit: boolean;
  toggleIsFastForm: (isOn: boolean) => void;
  toggleIsForceSkeleton: (isOn: boolean) => void;
  toggleIsForceFailDuringSubmit: (isOn: boolean) => void;
};

const ShortFormControlPanel: React.FC<ShortFormControlPanelProps> = (props) => {
  const {
    isSubmitDisabled = false,
    isResetDisabled = false,
    isFastForm,
    isForceSkeleton,
    isForceFailDuringSubmit,
    toggleIsFastForm,
    toggleIsForceSkeleton,
    toggleIsForceFailDuringSubmit,
  } = props;

  const { values, validateForm } = useFormikContext<ShortFormModel>();

  const handleDownload = () => {
    const formJson = JSON.stringify(values);
    const formBlob = new Blob([formJson], { type: "application/json" });

    // Must be removed manually otherwise stays alive for the lifetime of the document (heap?)
    const downloadUrl = URL.createObjectURL(formBlob);
    {
      // Attach temp <a> to the DOM and simulate click event
      const tempLinkElement = document.createElement("a");
      tempLinkElement.href = downloadUrl;
      tempLinkElement.download = "PERFECT test file.json";
      document.body.appendChild(tempLinkElement);
      tempLinkElement.click();
      document.body.removeChild(tempLinkElement);
    }
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <UploadFileButton />
      <Box display="flex" justifyContent="space-between" paddingTop={1} gap={1}>
        <Button
          variant="outlined"
          fullWidth
          size="small"
          type="reset"
          disabled={isResetDisabled}
          endIcon={<ClearIcon />}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="small"
          type="submit"
          disabled={isSubmitDisabled}
          color="primary"
          endIcon={<DoneIcon />}
        >
          Submit
        </Button>
      </Box>
      <Box display={"flex"} flexWrap={"wrap"} gap={1} alignItems={"center"}>
        <div>
          <CustomTooltip title={"Force skeleton (destroys the form!!!)"} arrow placement="bottom">
            <Checkbox
              checked={isForceSkeleton}
              onChange={(e) => toggleIsForceSkeleton(e.target.checked)}
              style={{ padding: 0 }}
            />
          </CustomTooltip>{" "}
          ☠️
        </div>
        <div>
          <CustomTooltip title={"Force a valid form to fail during submit"} arrow placement="bottom">
            <Checkbox
              checked={isForceFailDuringSubmit}
              onChange={(e) => toggleIsForceFailDuringSubmit(e.target.checked)}
              style={{ padding: 0 }}
            />
          </CustomTooltip>
          <PriorityHighIcon color="error" />
        </div>
        <div>
          <CustomTooltip title={"Validate now"} arrow placement="bottom">
            <Button73 text="✔️ VALIDATE NOW" handleClick={() => validateForm()} />
          </CustomTooltip>
        </div>
        <CustomSwitch isOn={isFastForm} handleToggle={toggleIsFastForm} tooltipLabel="Use the fast form..." />
        <CustomTooltip title={"Save your current progress in JSON"} arrow placement="bottom">
          <Button73 text="⬇️ Save THIS form" handleClick={handleDownload} />
        </CustomTooltip>
        <CustomTooltip title={"Perfect JSON to test upload"} arrow placement="bottom">
          <a href="/files/short-form-model-perfect-for-uploading.json" download="GOOD test file.json">
            <Button73 text="⬇️ PERFECT form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
        <CustomTooltip title={"Good but invalid JSON to test upload"} arrow placement="bottom">
          <a href="/files/short-form-model-okay-for-uploading.json" download="GOOD test file.json">
            <Button73 text="⬇️ OKAY form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
        <CustomTooltip title={"Malformed JSON to test upload"} arrow placement="bottom">
          <a href="/files/short-form-model-bad-for-uploading.json" download="BAD test file.json">
            <Button73 text="⬇️ BAD form" handleClick={() => {}} />
          </a>
        </CustomTooltip>
      </Box>
    </Box>
  );
};

const UploadFileButton: React.FC = () => {
  const { setValues } = useFormikContext<ShortFormModel>();
  const [isHoveringFile, setIsHoveringFile] = useState<boolean>(false);

  const preventBrowserDefaultBehaviour = (e: React.MouseEvent | React.KeyboardEvent | React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const loadFileContent = (file: File | undefined) => {
    if (!file) return;

    const parsingFilePromise = new Promise((resolve, reject) => {
      const reader = new FileReader(); // Don't worry, GC will clean this up...
      reader.onload = async (e) => {
        try {
          const rawContent = e.target?.result as string;
          const jsonContent = JSON.parse(rawContent);
          const newValues = await ShortFormModelSchema.cast(jsonContent);
          setValues(newValues);
          resolve(newValues);
        } catch (err) {
          console.warn("Unable to parse uploaded file", err);
          reject(new Error("Unable to load your file"));
        }
      };
      reader.readAsText(file);
    });

    toast.promise(
      parsingFilePromise,
      {
        loading: "Loading file...",
        success: "Pre-filled with your file!",
        error: (e: Error) => e.message,
      },
      { error: { icon: "⚠️" } } // most times the user's file is the problem, don't imply (red) error
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    loadFileContent(file);
    event.target.value = ""; // allow re-upload w same file name
  };

  const handleOnDrag = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
    const file = event.dataTransfer.files?.[0];
    loadFileContent(file);
    setIsHoveringFile(false);
  };

  const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
  };

  return (
    <div
      onDrop={handleOnDrag}
      onDragOver={handleOnDragOver}
      onDragEnter={() => setIsHoveringFile(true)}
      onDragLeave={() => setIsHoveringFile(false)}
      className={isHoveringFile ? "duration-150 ease-in-out scale-105" : ""}
    >
      <Button
        startIcon={<UploadFileIcon />}
        variant="outlined"
        component="label"
        size="small"
        color="info"
        fullWidth
        style={{ padding: 10 }}
      >
        Pre-fill with your JSON file
        <input type="file" accept=".json" hidden onChange={handleFileUpload} />
      </Button>
    </div>
  );
};

const MemoizedShortFormControlPanel = React.memo(ShortFormControlPanel);

export default MemoizedShortFormControlPanel;
