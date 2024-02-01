import { useMemo } from "react"

const light = {
  backgroundColor: "#fafafa",
  textColor: "#444",
  textColor2: "#626362",
  altTextColor: "#fff",
  mutedColor: "#888",
  primaryColor: "#03a9f4",
  successColor: "#00aa00",
  dangerColor: "#e00",
  warningColor: "#ee8a00",
  contentBackgroundColor: "#fff",
  borderColor: "#eee",
  inputBorderColor: "#bbb",
  selectedBackgroundColor: "#e1f5fe",
  eventBackgroundColor: "#e1f5fe",
  eventColor: "#047ad8",
  shadow: "0 0 2px rgb(0 0 0 / 60%)",
};


export const dark = {
  backgroundColor: "#474e5b",
  textColor: "#eee",
  textColor2: "#e3e3e3",
  altTextColor: "#fff",
  mutedColor: "#c4c6c9",
  primaryColor: "#03a9f4",
  successColor: "#00aa00",
  dangerColor: "#f26464",
  warningColor: "#ee8a00",
  contentBackgroundColor: "#4b525f",
  borderColor: "#5d5d5d",
  inputBorderColor: "#6c6c6c",
  selectedBackgroundColor: "#363e48",
  eventBackgroundColor: "#e1f5fe",
  eventColor: "#047ad8",
  shadow: "0 0 2px rgb(0 0 0 / 60%)",
};

export const useCalendarTheme = () => {

  const theme = light;
  
  return useMemo(() => {
    return {
      dayBackgroundColor: theme.contentBackgroundColor,
      weekendBackgroundColor: theme.backgroundColor,
      delimiter: theme.borderColor,
      weekendTextColor: theme.dangerColor,
      eventBorderRadius: "4px",
      weekDelimiter: theme.primaryColor,
      dayTextColor: theme.textColor,
      mutedTextColor: theme.mutedColor,
      defaultEventBackgroundColor: theme.eventBackgroundColor,
      defaultEventBackgroundTextColor: "#444",
    };
  }, []);
}