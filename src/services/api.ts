// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  profile: {
    role?: string;
    stage?: string;
    industry?: string;
    incubation?: string;
    ideaPitch?: string;
    roadblock?: string;
    timeline?: string;
    needs?: string[];
    keywordExecution?: string;
    superpower?: string;
    confidence?: number;
    workStyle?: string;
    motivation?: string;
    vibeBadge?: string;
    skills?: string[];
    collaboration?: string;
    hackathonInterest?: string;
    badges?: string[];
  };
  company?: {
    name?: string;
    website?: string;
    description?: string;
    founded?: string;
    teamSize?: string;
    location?: string;
  };
  contact?: {
    phone?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'connections';
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
  activity?: {
    lastLogin?: string;
    totalLogins?: number;
    ideasAnalyzed?: number;
    mentorsConnected?: number;
    postsCreated?: number;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IdeaAnalysis {
  _id?: string;
  userId?: string;
  userUid: string;
  ideaName: string;
  ideaDescription: string;
  analysis: any; // StartupAnalysis from gemini.ts
  analysisMetadata?: {
    geminiModel?: string;
    processingTime?: number;
    tokensUsed?: number;
    confidence?: number;
    quality?: 'excellent' | 'good' | 'fair' | 'poor';
  };
  userInteraction?: {
    isBookmarked?: boolean;
    isShared?: boolean;
    rating?: number;
    feedback?: string;
    lastViewed?: string;
    viewCount?: number;
  };
  status?: 'draft' | 'completed' | 'archived' | 'deleted';
  visibility?: 'private' | 'public' | 'connections';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // User Profile APIs
  async getUserProfile(uid: string, email: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile', {
      method: 'GET',
      headers: {
        uid,
        email,
      },
    });
  }

  async updateUserProfile(
    uid: string,
    email: string,
    profileData: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile', {
      method: 'PUT',
      headers: {
        uid,
        email,
      },
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats(uid: string, email: string): Promise<ApiResponse<any>> {
    return this.request<any>('/users/stats', {
      method: 'GET',
      headers: {
        uid,
        email,
      },
    });
  }

  async searchUsers(
    uid: string,
    email: string,
    query: string,
    filters?: { role?: string; industry?: string; limit?: number }
  ): Promise<ApiResponse<UserProfile[]>> {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.role && { role: filters.role }),
      ...(filters?.industry && { industry: filters.industry }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
    });

    return this.request<UserProfile[]>(`/users/search?${params}`, {
      method: 'GET',
      headers: {
        uid,
        email,
      },
    });
  }

  // Idea Analysis APIs
  async createIdeaAnalysis(
    uid: string,
    email: string,
    ideaName: string,
    ideaDescription: string
  ): Promise<ApiResponse<IdeaAnalysis>> {
    return this.request<IdeaAnalysis>('/idea-analysis', {
      method: 'POST',
      headers: {
        uid,
        email,
      },
      body: JSON.stringify({
        ideaName,
        ideaDescription,
      }),
    });
  }

  async updateIdeaAnalysis(
    uid: string,
    email: string,
    analysisId: string,
    analysis: any,
    metadata?: any
  ): Promise<ApiResponse<IdeaAnalysis>> {
    return this.request<IdeaAnalysis>(`/idea-analysis/${analysisId}/analysis`, {
      method: 'PUT',
      headers: {
        uid,
        email,
      },
      body: JSON.stringify({
        analysis,
        metadata,
      }),
    });
  }

  async getUserIdeaAnalyses(
    uid: string,
    email: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      visibility?: string;
    }
  ): Promise<ApiResponse<{ analyses: IdeaAnalysis[]; pagination: any }>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.visibility) params.append('visibility', options.visibility);

    return this.request<{ analyses: IdeaAnalysis[]; pagination: any }>(
      `/idea-analysis?${params}`,
      {
        method: 'GET',
        headers: {
          uid,
          email,
        },
      }
    );
  }

  async getIdeaAnalysis(
    uid: string,
    email: string,
    analysisId: string
  ): Promise<ApiResponse<IdeaAnalysis>> {
    return this.request<IdeaAnalysis>(`/idea-analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        uid,
        email,
      },
    });
  }

  async updateIdeaAnalysisInteraction(
    uid: string,
    email: string,
    analysisId: string,
    action: 'bookmark' | 'rate' | 'share',
    rating?: number,
    feedback?: string
  ): Promise<ApiResponse<IdeaAnalysis>> {
    return this.request<IdeaAnalysis>(`/idea-analysis/${analysisId}/interaction`, {
      method: 'PUT',
      headers: {
        uid,
        email,
      },
      body: JSON.stringify({
        action,
        rating,
        feedback,
      }),
    });
  }

  async updateIdeaAnalysisVisibility(
    uid: string,
    email: string,
    analysisId: string,
    visibility: 'private' | 'public' | 'connections'
  ): Promise<ApiResponse<IdeaAnalysis>> {
    return this.request<IdeaAnalysis>(`/idea-analysis/${analysisId}/visibility`, {
      method: 'PUT',
      headers: {
        uid,
        email,
      },
      body: JSON.stringify({
        visibility,
      }),
    });
  }

  async deleteIdeaAnalysis(
    uid: string,
    email: string,
    analysisId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/idea-analysis/${analysisId}`, {
      method: 'DELETE',
      headers: {
        uid,
        email,
      },
    });
  }

  async searchPublicAnalyses(
    query?: string,
    tags?: string[],
    limit?: number
  ): Promise<ApiResponse<IdeaAnalysis[]>> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags?.length) params.append('tags', tags.join(','));
    if (limit) params.append('limit', limit.toString());

    return this.request<IdeaAnalysis[]>(`/idea-analysis/public/search?${params}`, {
      method: 'GET',
    });
  }

  async getTrendingAnalyses(limit?: number): Promise<ApiResponse<IdeaAnalysis[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    return this.request<IdeaAnalysis[]>(`/idea-analysis/public/trending?${params}`, {
      method: 'GET',
    });
  }

  async getAnalysisStats(uid: string, email: string): Promise<ApiResponse<any>> {
    return this.request<any>('/idea-analysis/stats/overview', {
      method: 'GET',
      headers: {
        uid,
        email,
      },
    });
  }

  // Utility method to save complete analysis
  async saveCompleteAnalysis(
    uid: string,
    email: string,
    ideaName: string,
    ideaDescription: string,
    analysis: any,
    metadata?: any
  ): Promise<ApiResponse<IdeaAnalysis>> {
    try {
      // First create the analysis record
      const createResponse = await this.createIdeaAnalysis(
        uid,
        email,
        ideaName,
        ideaDescription
      );

      if (!createResponse.success || !createResponse.data) {
        throw new Error(createResponse.error || 'Failed to create analysis record');
      }

      // Then update it with the analysis data
      const updateResponse = await this.updateIdeaAnalysis(
        uid,
        email,
        createResponse.data._id!,
        analysis,
        metadata
      );

      return updateResponse;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save analysis',
      };
    }
  }
}

export const apiService = new ApiService();
export type { UserProfile, IdeaAnalysis, ApiResponse };
