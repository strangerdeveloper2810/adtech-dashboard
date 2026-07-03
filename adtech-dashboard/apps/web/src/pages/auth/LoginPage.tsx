import { type FC, type JSX } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/features/auth/authApi";
import { useAppDispatch } from "@/app/hooks";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginInput, loginSchema } from "@/validation/auth.validation";
import { toast } from "@adtech/ui";
import { setCredentials } from "@/features/auth/authSlice";

const LoginPage: FC = (): JSX.Element => {
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSubmitFormLogin = async (data: LoginInput): Promise<void> => {
    try {
      const result = await login(data).unwrap();

      dispatch(setCredentials(result.data));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      const message = (err as any)?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" mb={3}>
            AdTech Dashboard
          </Typography>

          <form onSubmit={handleSubmit(handleSubmitFormLogin)} noValidate>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
