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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          report_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          report_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          report_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_report"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          liked: boolean
          likes: number
          preview: string
          replies: Json
          tags: Json
          time_ago: string
          title: string
        }
        Insert: {
          author?: string
          content: string
          created_at?: string
          id: string
          liked?: boolean
          likes?: number
          preview?: string
          replies?: Json
          tags?: Json
          time_ago?: string
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          liked?: boolean
          likes?: number
          preview?: string
          replies?: Json
          tags?: Json
          time_ago?: string
          title?: string
        }
        Relationships: []
      }
      Post: {
        Row: {
          authorId: number
          content: string
          createdAt: string
          id: number
          title: string
          updatedAt: string
        }
        Insert: {
          authorId: number
          content: string
          createdAt?: string
          id?: number
          title: string
          updatedAt: string
        }
        Update: {
          authorId?: number
          content?: string
          createdAt?: string
          id?: number
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Post_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          business_name: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          full_name: string | null
          id: string
          industry: string | null
          location: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          breakdown: Json
          generated_at: string
          id: string
          insights: Json
          metrics: Json
          period: string
          summary: string | null
          user_id: string
        }
        Insert: {
          breakdown?: Json
          generated_at?: string
          id?: string
          insights?: Json
          metrics?: Json
          period: string
          summary?: string | null
          user_id: string
        }
        Update: {
          breakdown?: Json
          generated_at?: string
          id?: string
          insights?: Json
          metrics?: Json
          period?: string
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      source_documents: {
        Row: {
          created_at: string
          error_message: string | null
          file_name: string
          file_size_bytes: number
          file_type: string
          id: string
          row_count: number
          status: string
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size_bytes: number
          file_type: string
          id?: string
          row_count?: number
          status?: string
          storage_path?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size_bytes?: number
          file_type?: string
          id?: string
          row_count?: number
          status?: string
          storage_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracker_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          report_id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          report_id: string
          role: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          report_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracker_chat_messages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "tracker_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      tracker_documents: {
        Row: {
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          kind: string
          row_count: number
          status: string
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          kind: string
          row_count?: number
          status?: string
          storage_path?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          kind?: string
          row_count?: number
          status?: string
          storage_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracker_reports: {
        Row: {
          ai_summary: Json
          business_name: string
          created_at: string
          id: string
          metrics: Json
          period: string
          range_end: string
          range_start: string
          user_id: string
        }
        Insert: {
          ai_summary: Json
          business_name: string
          created_at?: string
          id?: string
          metrics: Json
          period: string
          range_end: string
          range_start: string
          user_id?: string
        }
        Update: {
          ai_summary?: Json
          business_name?: string
          created_at?: string
          id?: string
          metrics?: Json
          period?: string
          range_end?: string
          range_start?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_transactions: {
        Row: {
          category: string | null
          created_at: string
          date: string
          document_id: string | null
          id: string
          kind: string
          name: string
          price: number
          quantity: number
          user_id: string
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          document_id?: string | null
          id?: string
          kind: string
          name: string
          price: number
          quantity?: number
          user_id?: string
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          document_id?: string | null
          id?: string
          kind?: string
          name?: string
          price?: number
          quantity?: number
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "tracker_transactions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "tracker_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          price: number | null
          source_document_id: string | null
          type: string
          user_id: string
          value: number
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          source_document_id?: string | null
          type: string
          user_id?: string
          value: number
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          source_document_id?: string | null
          type?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          id: number
          image: string | null
          name: string
          password: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: number
          image?: string | null
          name: string
          password: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: number
          image?: string | null
          name?: string
          password?: string
          updatedAt?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
