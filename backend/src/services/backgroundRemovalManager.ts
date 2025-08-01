interface UsageStats {
  removeBgUsed: number;
  removeBgLimit: number;
  localProcessed: number;
  totalProcessed: number;
  resetDate: string;
}

class BackgroundRemovalManager {
  private usageStats: UsageStats;
  private readonly REMOVE_BG_MONTHLY_LIMIT = 50;

  constructor() {
    this.usageStats = this.loadUsageStats();
  }

  private loadUsageStats(): UsageStats {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    // In a real app, load from database or file
    const saved = process.env.USAGE_STATS || '{}';
    const stats = JSON.parse(saved);
    
    // Reset if new month
    if (stats.resetDate !== currentMonth) {
      return {
        removeBgUsed: 0,
        removeBgLimit: this.REMOVE_BG_MONTHLY_LIMIT,
        localProcessed: 0,
        totalProcessed: 0,
        resetDate: currentMonth
      };
    }
    
    return stats;
  }

  private saveUsageStats(): void {
    // In a real app, save to database or file
    console.log('Usage stats:', this.usageStats);
  }

  public async removeBackground(imageBuffer: Buffer, forceAPI: boolean = false): Promise<{
    result: Buffer;
    method: 'local' | 'remove-bg' | 'photoshop-api' | 'clipdrop';
    remainingApiCalls: number;
  }> {
    // Check if we should use API or local processing
    const shouldUseAPI = forceAPI || this.shouldUseAPI();
    
    if (shouldUseAPI && this.usageStats.removeBgUsed < this.usageStats.removeBgLimit) {
      try {
        const result = await this.useRemoveBgAPI(imageBuffer);
        this.usageStats.removeBgUsed++;
        this.usageStats.totalProcessed++;
        this.saveUsageStats();
        
        return {
          result,
          method: 'remove-bg',
          remainingApiCalls: this.usageStats.removeBgLimit - this.usageStats.removeBgUsed
        };
      } catch (error) {
        console.error('Remove.bg API failed, trying alternatives...', error);
      }
    }

    // Try alternative APIs or local processing
    try {
      const result = await this.useLocalProcessing(imageBuffer);
      this.usageStats.localProcessed++;
      this.usageStats.totalProcessed++;
      this.saveUsageStats();
      
      return {
        result,
        method: 'local',
        remainingApiCalls: this.usageStats.removeBgLimit - this.usageStats.removeBgUsed
      };
    } catch (error) {
      throw new Error('All background removal methods failed');
    }
  }

  private shouldUseAPI(): boolean {
    // Use API for high-quality results when available
    // Use local for bulk processing or when API limit reached
    const apiCallsRemaining = this.usageStats.removeBgLimit - this.usageStats.removeBgUsed;
    
    // Save API calls for the end of the month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const daysRemaining = daysInMonth - dayOfMonth;
    
    // Use API if we have more calls than days remaining
    return apiCallsRemaining > Math.max(daysRemaining, 5);
  }

  private async useRemoveBgAPI(imageBuffer: Buffer): Promise<Buffer> {
    // Your existing Remove.bg implementation
    const { removeBackground } = require('./backgroundRemovalService');
    return await removeBackground(imageBuffer);
  }

  private async useLocalProcessing(imageBuffer: Buffer): Promise<Buffer> {
    // Local AI processing - multiple options
    console.log('Using local AI processing...');
    
    // Option 1: Use sharp for basic processing (placeholder)
    const sharp = require('sharp');
    
    // This is a simplified version
    // In production, you'd integrate actual AI models
    const result = await sharp(imageBuffer)
      .png()
      .toBuffer();
    
    // For now, throw error to indicate local AI needs implementation
    throw new Error('Local AI implementation needed - install rembg or similar');
  }

  public getUsageStats(): UsageStats {
    return { ...this.usageStats };
  }
}

export const backgroundRemovalManager = new BackgroundRemovalManager();
