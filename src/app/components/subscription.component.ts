import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../services/logger/logger.service';

@Component({ template: '' })
export class HasSubscriptions implements OnDestroy {
    private _subscriptions: Subscription[] = [];

    protected destroy() { }

    ngOnDestroy(): void {
        // Logger.log(`HasSubscriptions destroy {${this._subscriptions.length}}`)
        this._subscriptions.forEach(subscription => subscription.unsubscribe())
        this.destroy();
    }

    public addSubscription(subscription: Subscription): void {
        this._subscriptions.push(subscription)
    }
}