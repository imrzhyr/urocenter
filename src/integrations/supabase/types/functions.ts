export interface Functions {
  gen_random_uuid: {
    Args: Record<PropertyKey, never>;
    Returns: {
      user_id: string;
    }[];
  };
  set_user_context: {
    Args: {
      user_phone: string;
    };
    Returns: undefined;
  };
  set_claim: {
    Args: {
      claim: string;
      value: string;
    };
    Returns: undefined;
  };
}