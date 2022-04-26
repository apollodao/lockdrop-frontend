/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A thin wrapper around u128 that is using strings for JSON encoding/decoding, such that the full u128 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances of this and `u128` to get the value out:
 *
 * ``` # use cosmwasm_std::Uint128; let a = Uint128::from(123u128); assert_eq!(a.u128(), 123);
 *
 * let b = Uint128::from(42u64); assert_eq!(b.u128(), 42);
 *
 * let c = Uint128::from(70u32); assert_eq!(c.u128(), 70); ```
 */
export type Uint128 = string;
/**
 * A human readable address.
 *
 * In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.
 *
 * This type represents a validated address. It can be created in the following ways 1. Use `Addr::unchecked(input)` 2. Use `let checked: Addr = deps.api.addr_validate(input)?` 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?` 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract's state. `Addr` must not be used in messages sent by the user because this would result in unvalidated instances.
 *
 * This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.
 */
export type Addr = string;
/**
 * An implementation of u256 that is using strings for JSON encoding/decoding, such that the full u256 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances out of primitive uint types or `new` to provide big endian bytes:
 *
 * ``` # use cosmwasm_std::Uint256; let a = Uint256::from(258u128); let b = Uint256::new([ 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 1u8, 2u8, ]); assert_eq!(a, b); ```
 */
export type Uint256 = string;

export interface LockUpInfoResponse {
  /**
   * APOLLO tokens received as rewards for participation in the lockdrop
   */
  apollo_rewards: Uint128;
  /**
   * the amount of APOLLO reward tokens that have been claimed already
   */
  apollo_tokens_claimed: Uint128;
  /**
   * the amount of APOLLO rewards tokens are available to claim
   */
  claimable_apollo_tokens: Uint128;
  /**
   * Duration in weeks
   */
  duration: number;
  /**
   * token
   */
  token_address: Addr;
  /**
   * units locked by the user
   */
  units_locked: Uint128;
  /**
   * Timestamp beyond which this position can be unlocked
   */
  unlock_timestamp: number;
  /**
   * weighted sum of the lockup
   */
  weighted_sum: Uint256;
  /**
   * Boolean value indicating if the user's has withdrawn funds post the only 1 withdrawal limit cutoff
   */
  withdrawal_flag: boolean;
  [k: string]: unknown;
}
