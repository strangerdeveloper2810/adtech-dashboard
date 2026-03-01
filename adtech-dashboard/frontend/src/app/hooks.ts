import { useDispatch, useSelector } from "react-redux";
import store from "./store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const useAppSelector = useSelector.withTypes<RootState>();

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export { useAppSelector, useAppDispatch };
