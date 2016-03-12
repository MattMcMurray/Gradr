package com.se2.gradr.gradr.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import com.se2.gradr.gradr.R;
import com.se2.gradr.gradr.User;
import com.se2.gradr.gradr.UserAndImage;
import com.se2.gradr.gradr.ViewMatchActivity;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ViewMatchFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ViewMatchFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RateMatchFragment extends Fragment {

    private final int RATING_OUT_OF = 5;

    private int userId;
    private String username;
    private UserAndImage match;

    private Integer[] ratingOptions;

    private OnFragmentInteractionListener mListener;

    //We call findViewById on this guy
    private View rootView;

    public RateMatchFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param userId ID of the current signed in user
     * @param username username of the current signed in user
     * @param match a User object containing info about the match we're investigating
     * @return A new instance of fragment ViewMatchFragment.
     */
    public static RateMatchFragment newInstance(int userId, String username, User match) {
        RateMatchFragment fragment = new RateMatchFragment();
        Bundle args = new Bundle();
        args.putInt("id", userId);
        args.putString("username", username);
        args.putSerializable("match", match);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            userId = getArguments().getInt("id");
            username = getArguments().getString("username");
            User currMatch = (User) getArguments().getSerializable("match");
            match = new UserAndImage(currMatch);
        }
        ratingOptions = new Integer[RATING_OUT_OF];
        for (int i = 0; i < RATING_OUT_OF; i++) {
            ratingOptions[i] = i+1;
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_rate_match, container, false);
        populateFields();
        getRatings();
        return rootView;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    public void populateFields() {
        Spinner ratingSpinner = (Spinner) rootView.findViewById(R.id.rating_spinner);
        ArrayAdapter<Integer> adapter = new ArrayAdapter<Integer>(rootView.getContext(),
                 android.R.layout.simple_spinner_item,  ratingOptions);
        ratingSpinner.setAdapter(adapter);

        TextView tv = (TextView) rootView.findViewById(R.id.match_name);
        tv.setText(match.getFirstName() + " " + match.getLastName());

        final Button submit = (Button) rootView.findViewById(R.id.submit_rating_button);
        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: POST the review

            }
        });
    }

    public void getRatings() {
        //TODO: GET the ratings for this user. Also, need to add textbox where we'll put their aggregate rating
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
