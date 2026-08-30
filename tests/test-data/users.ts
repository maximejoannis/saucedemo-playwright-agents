export type SauceDemoUser = Readonly<{
  username: string;
  password: string;
}>;

const password = 'secret_sauce';

export const sauceDemoUsers = {
  standard: { username: 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
  problem: { username: 'problem_user', password },
  error: { username: 'error_user', password },
} as const satisfies Record<string, SauceDemoUser>;
