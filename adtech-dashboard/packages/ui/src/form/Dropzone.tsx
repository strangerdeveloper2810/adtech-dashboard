import { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { DropzoneProps } from '@adtech/types';

export function Dropzone({ onFiles, accept, hint }: DropzoneProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      sx={{
        border: '1.5px dashed',
        borderColor: drag ? 'primary.main' : 'divider',
        bgcolor: drag ? 'action.hover' : 'background.paper',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple
        hidden
        ref={inputRef}
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
      <CloudUploadIcon color="action" />
      <Typography variant="body2">Drag and drop files here, or click to browse</Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Box>
  );
}
