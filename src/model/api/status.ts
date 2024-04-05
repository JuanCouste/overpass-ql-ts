export interface OverpassRunningQuery {
	readonly pid: number;
	readonly spaceLimit: number;
	readonly timeLimit: number;
	readonly start: Date;
}

export interface OverpassStatus {
	readonly connectedAs: number;
	readonly currentTime: Date;
	readonly announcedEndpoint?: string;
	readonly ratelimit: number;
	readonly aviableSlots: number;
	readonly runningQueries: OverpassRunningQuery[];
}
