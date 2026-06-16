export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          action: string
          convict_id: string
          convict_name: string
          duration: number | null
          guild_id: string
          guild_name: string
          id: number
          mod_id: string
          mod_name: string
          reason: string
        }
        Insert: {
          action: string
          convict_id: string
          convict_name: string
          duration?: number | null
          guild_id: string
          guild_name: string
          id?: number
          mod_id: string
          mod_name: string
          reason: string
        }
        Update: {
          action?: string
          convict_id?: string
          convict_name?: string
          duration?: number | null
          guild_id?: string
          guild_name?: string
          id?: number
          mod_id?: string
          mod_name?: string
          reason?: string
        }
        Relationships: []
      }
      appeals: {
        Row: {
          appeal: string[]
          id: number
        }
        Insert: {
          appeal: string[]
          id?: number
        }
        Update: {
          appeal?: string[]
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "appeals_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
        ]
      }
      "channel theme": {
        Row: {
          category_id: string
          category_name: string
          channel_list: Json
          guild_id: string
        }
        Insert: {
          category_id: string
          category_name: string
          channel_list: Json
          guild_id: string
        }
        Update: {
          category_id?: string
          category_name?: string
          channel_list?: Json
          guild_id?: string
        }
        Relationships: []
      }
      "chat xp": {
        Row: {
          guild_id: string
          id: number
          level: number
          user_id: string
          weekly_xp: number
          xp: number
        }
        Insert: {
          guild_id: string
          id?: number
          level?: number
          user_id: string
          weekly_xp?: number
          xp?: number
        }
        Update: {
          guild_id?: string
          id?: number
          level?: number
          user_id?: string
          weekly_xp?: number
          xp?: number
        }
        Relationships: []
      }
      "colour theme": {
        Row: {
          colour_list: Json
          guild_id: string
        }
        Insert: {
          colour_list: Json
          guild_id: string
        }
        Update: {
          colour_list?: Json
          guild_id?: string
        }
        Relationships: []
      }
      economy: {
        Row: {
          bank: number | null
          bank_limit: number | null
          daily_streak: number | null
          id: string
          last_crime: string | null
          last_daily: string | null
          last_monthly: string | null
          last_weekly: string | null
          last_work: string | null
          user_id: string
          wallet: number | null
          work_hours: number | null
        }
        Insert: {
          bank?: number | null
          bank_limit?: number | null
          daily_streak?: number | null
          id?: string
          last_crime?: string | null
          last_daily?: string | null
          last_monthly?: string | null
          last_weekly?: string | null
          last_work?: string | null
          user_id: string
          wallet?: number | null
          work_hours?: number | null
        }
        Update: {
          bank?: number | null
          bank_limit?: number | null
          daily_streak?: number | null
          id?: string
          last_crime?: string | null
          last_daily?: string | null
          last_monthly?: string | null
          last_weekly?: string | null
          last_work?: string | null
          user_id?: string
          wallet?: number | null
          work_hours?: number | null
        }
        Relationships: []
      }
      "level up channel": {
        Row: {
          channel_id: string
          guild_id: string
        }
        Insert: {
          channel_id: string
          guild_id: string
        }
        Update: {
          channel_id?: string
          guild_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
