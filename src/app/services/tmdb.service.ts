import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { TmdbImagesResponse } from "src/interfaces/TmdbImagesResponse";
import { Observable, map } from "rxjs";
import { TmdbImage } from "src/interfaces/TmdbImage";

const API_ROOT = "https://api.themoviedb.org/3/";

export enum ImageQuality {
    W45,
    W92,
    W154,
    W185,
    W300,
    W342,
    W500,
    W780,
    W1280,
    Original,
}

export enum MovieImageType {
    Logo,
    Poster,
    Backdrop,
}

function imageQualityUrlPrefix(
    quality: ImageQuality,
    imageType: MovieImageType
) {
    const qualities = [
        "w45",
        "w92",
        "w154",
        "w185",
        "w300",
        "w342",
        "w500",
        "w780",
        "w1280",
        "original",
    ];

    // Exceptions for image types that don't support certain sizes
    switch (imageType) {
        case MovieImageType.Logo:
            qualities[ImageQuality.W342] = "w300";
            qualities[ImageQuality.W780] = "w500";
            qualities[ImageQuality.W1280] = "w500";
            break;
        case MovieImageType.Poster:
            qualities[ImageQuality.W45] = "w92";
            qualities[ImageQuality.W300] = "w342";
            qualities[ImageQuality.W1280] = "w780";
            break;
        case MovieImageType.Backdrop:
            qualities[ImageQuality.W45] = "w300";
            qualities[ImageQuality.W92] = "w300";
            qualities[ImageQuality.W154] = "w300";
            qualities[ImageQuality.W185] = "w300";
            qualities[ImageQuality.W342] = "w300";
            qualities[ImageQuality.W500] = "w780";
            break;
    }

    return "https://image.tmdb.org/t/p/" + qualities[quality];
}

@Injectable({
    providedIn: "root",
})
export class TmdbService {
    private imageCache: Map<number, TmdbImagesResponse> = new Map();
    private imageQueue: Map<number, Observable<TmdbImagesResponse>> =
        new Map();
    private requestCounter: number = 5;

    constructor(private httpClient: HttpClient) {
        setInterval(() => (this.requestCounter = 5), 1000);
    }

    private request<T>(url: string) {
        return this.httpClient.get<T>(API_ROOT + url, {
            headers: {
                Authorization: "Bearer " + environment.tmdbApiAccessToken,
                accept: "application/json",
            },
        });
    }

    public getMovieImages(id: number, forceReload: boolean = false) {
        let poster = this.imageCache.get(id);

        if (!forceReload && poster) {
            return new Observable<TmdbImagesResponse>((subscriber) => {
                subscriber.next(poster);
                subscriber.complete();
            });
        }

        this.requestCounter -= 1;
        if (this.requestCounter < 0) {
            return new Observable<TmdbImagesResponse>((subscriber) => {
                setTimeout(() => {
                    this.getMovieImages(id, forceReload).subscribe((res) => {
                        subscriber.next(res);
                        subscriber.complete();
                    });
                }, 100);
            });
        }

        if (this.imageQueue.has(id)) {
            return this.imageQueue.get(id)!;
        }

        let observable = this.request<TmdbImagesResponse>(
            "movie/" + id + "/images?language=en"
        );
        observable.subscribe((response) => {
            this.imageCache.set(id, response);
            this.imageQueue.delete(id);
        });
        this.imageQueue.set(id, observable);

        return observable;
    }

    /**
     * Get an image related to a movie. This method requests all the images from
     * the API and picks the highest-reviewed one based off vote_average, weighted
     * with vote_count to eliminate weird edge cases.
     *
     * @param id The ID of the movie you want to query the image for
     * @param imageType Options: [Logo, Poster, Backdrop]
     * @param quality The requested quality of the image, options: [Small, Original].
     * @param forceReload Ignore cache, if you dare to use this you better have a
     * damn good reason to do so.
     * @returns An observable that resolves to the requested image url
     */
    // prettier-ignore
    public getMovieImage(id: number, imageType: MovieImageType, quality: ImageQuality, forceReload: boolean = false) {
        return this.getMovieImages(id, forceReload).pipe(map((response: TmdbImagesResponse) => {
            let images: TmdbImage[] = [];

            switch (imageType) {
                case MovieImageType.Logo: images = response.logos; break;
                case MovieImageType.Poster: images = response.posters; break;
                case MovieImageType.Backdrop: images = response.backdrops; break;
            }

            let prefix = imageQualityUrlPrefix(quality, imageType);

            if (images.length == 0) {
                return "/assets/logo.png";
            } else if (images.length == 1) {
                return prefix + images[0].file_path;
            }

            // Find best image
            let maxVotes = [...images].map(i => i.vote_count).reduce((p, c) => Math.max(p, c));
            let weighted = [...images].map(i => i.vote_average * Math.pow(i.vote_count / maxVotes, 2.0));
            let topImage = [...weighted].map((v, i) => [v, i]).reduce((p, c, i) => [Math.max(p[0], c[0]), i])[1];

            return prefix + images[topImage].file_path;
        }));
    }
}
