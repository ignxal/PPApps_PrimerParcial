export interface DeviceMotionEvent extends Event {
  readonly acceleration: DeviceMotionEventAcceleration | null;
  readonly accelerationIncludingGravity: DeviceMotionEventAcceleration | null;
  readonly rotationRate: DeviceMotionEventRotationRate | null;
  readonly interval: number;
  requestPermission?: () => Promise<'granted' | 'denied'>;
}
