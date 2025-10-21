export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          match_id: string;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: string;
          match_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          match_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: true;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
        ];
      };
      draw_participants: {
        Row: {
          created_at: string;
          draw_id: string;
          email: string;
          gift_preferences: string;
          id: string;
          name: string;
          surname: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          draw_id: string;
          email: string;
          gift_preferences: string;
          id?: string;
          name: string;
          surname: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          draw_id?: string;
          email?: string;
          gift_preferences?: string;
          id?: string;
          name?: string;
          surname?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "draw_participants_draw_id_fkey";
            columns: ["draw_id"];
            isOneToOne: false;
            referencedRelation: "draws";
            referencedColumns: ["id"];
          },
        ];
      };
      draws: {
        Row: {
          author_id: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          created_at: string;
          draw_id: string;
          giver_id: string;
          id: string;
          recipient_id: string;
        };
        Insert: {
          created_at?: string;
          draw_id: string;
          giver_id: string;
          id?: string;
          recipient_id: string;
        };
        Update: {
          created_at?: string;
          draw_id?: string;
          giver_id?: string;
          id?: string;
          recipient_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_draw_id_fkey";
            columns: ["draw_id"];
            isOneToOne: false;
            referencedRelation: "draws";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_giver_id_fkey";
            columns: ["giver_id"];
            isOneToOne: false;
            referencedRelation: "draw_participants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "draw_participants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      armor: {
        Args: { "": string };
        Returns: string;
      };
      dearmor: {
        Args: { "": string };
        Returns: string;
      };
      gen_random_bytes: {
        Args: { "": number };
        Returns: string;
      };
      gen_random_uuid: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      gen_salt: {
        Args: { "": string };
        Returns: string;
      };
      pgp_armor_headers: {
        Args: { "": string };
        Returns: Record<string, unknown>[];
      };
      pgp_key_id: {
        Args: { "": string };
        Returns: string;
      };
    };
    Enums: {
      user_role_enum: "author" | "participant";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_role_enum: ["author", "participant"],
    },
  },
} as const;
