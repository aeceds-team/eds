# Video Title block authoring

Use these steps to author the Video Title block in Google Docs (or Word):

1. Insert a table. In the first row, type `Video Title` in the first cell and leave the other cells empty. This names the block.
  2. Each subsequent row represents one video card and uses two columns:
     - **Column 1 – Title**: Add the title you want displayed. For YouTube links this column is optional—the block will fetch the video title automatically if left blank.
     - **Column 2 – Video**: Add either a YouTube URL (as a hyperlink **or plain text**) or an uploaded video.
       - *YouTube variant*: paste the YouTube link. The block pulls the title from YouTube (via oEmbed) and uses the YouTube thumbnail.
       - *Uploaded video variant*: upload your MP4 to an accessible location (e.g., your AEM Assets library or a shared Google Drive/SharePoint link set to "Anyone with the link"), then paste that HTTPS URL in this cell as a link or plain text. Provide the display title in Column 1. If you add an image in the same cell (e.g., a poster frame), it will be used as the card thumbnail. Google Drive share links like `https://drive.google.com/file/d/FILE_ID/view` are automatically converted to a playable download URL, but the file must be shared publicly (anyone with the link) to load in the modal player.
3. Publish the page. Each row renders as a card with a thumbnail and title. Clicking the card opens a modal that plays the selected video.

Tips:
- Leave Column 1 blank only when you want the YouTube title to be fetched automatically. Add a custom title when uploading your own video.
- If no thumbnail is supplied for uploaded videos, the block shows a branded gradient placeholder behind the play icon.
