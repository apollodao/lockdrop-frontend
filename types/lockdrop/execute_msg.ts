/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ExecuteMsg =
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      update_config: {
        new_config: UpdateConfigMsg;
        [k: string]: unknown;
      };
    }
  | {
      enable_claims: {
        [k: string]: unknown;
      };
    }
  | {
      initialize_asset: {
        incentives_share: Uint128;
        token_address: string;
        [k: string]: unknown;
      };
    }
  | {
      update_asset: {
        incentives_share: Uint128;
        token_address: string;
        [k: string]: unknown;
      };
    }
  | {
      callback: CallbackMsg;
    }
  | {
      withdraw_from_lockup: {
        amount: Uint128;
        duration: number;
        token_address: string;
        [k: string]: unknown;
      };
    }
  | {
      claim_rewards_and_optionally_unlock: {
        duration: number;
        token_address: string;
        withdraw_lp_stake: boolean;
        [k: string]: unknown;
      };
    }
  | {
      deposit_into_convex_model: {
        amount?: Uint128 | null;
        recipient?: string | null;
        strategy_address: string;
        [k: string]: unknown;
      };
    };
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
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>
 */
export type Binary = string;
export type CallbackMsg = {
  astro_deposit_increase_lockup: {
    duration: number;
    user_address: Addr;
    xastro_balance_before_callback: Uint128;
    [k: string]: unknown;
  };
};
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
 * Cw20ReceiveMsg should be de/serialized under `Receive()` variant in a ExecuteMsg
 */
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
  [k: string]: unknown;
}
export interface UpdateConfigMsg {
  /**
   * APOLLO Factory
   */
  apollo_factory?: string | null;
  /**
   * APOLLO Token
   */
  apollo_token?: string | null;
  astro_token?: string | null;
  astroport_staking?: string | null;
  /**
   * Number of seconds during which lockup deposits will be accepted
   */
  deposit_window?: number | null;
  /**
   * Timestamp when Contract will start accepting LP Token deposits
   */
  init_timestamp?: number | null;
  /**
   * Max. no. of weeks allowed for lockup
   */
  max_lock_duration?: number | null;
  /**
   * Max lockup positions a user can have
   */
  max_positions_per_user?: number | null;
  /**
   * Min. no. of weeks allowed for lockup
   */
  min_lock_duration?: number | null;
  /**
   * Account which can update config
   */
  owner?: string | null;
  /**
   * Withdrawal Window Length :: Post the deposit window
   */
  withdrawal_window?: number | null;
  /**
   * xASTRO token address
   */
  xastro_token?: string | null;
  [k: string]: unknown;
}
