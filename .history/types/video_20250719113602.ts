export interface vidoe{
 
                _id: string,
                title: string,
                slug: string,
                description:string,
                videoUrl: string,
                videoKey: string,
                thumbnailUrl: string,
                thumbnailKey: string,
                duration: number,
                source: string,
                genres: string[],
                status: string,
                viewCount: number,
                completionCount: number,
                pointsReward: number,
                minimumWatchTime: number,
                isFeatured: boolean,
                isTrending: boolean,
                sortOrder: number,
                tags: string[],
                uploadedBy: string,
                createdAt: string,
                updatedAt: string,
                streamUrl: string,
                thumbnailSignedUrl: string
    
}